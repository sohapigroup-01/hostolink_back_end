import {
    BadRequestException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
  } from '@nestjs/common';
  import { DataSource } from 'typeorm';
  
  @Injectable()
  export class PaiementService {
    constructor(private readonly dataSource: DataSource) {}
  
    async payerParQr(token: string, montant: number, idUser: string) {
      if (!token || !montant || !idUser) {
        throw new BadRequestException('Données manquantes');
      }
  
      // 1. 🔍 Vérifie si le QR dynamique existe et est valide
      const [qr] = await this.dataSource.query(
        `SELECT * FROM qr_code_paiement_dynamique 
         WHERE token = $1 AND statut = 'actif' AND date_expiration > NOW() LIMIT 1`,
        [token],
      );
  
      if (!qr) {
        throw new NotFoundException('QR Code invalide ou expiré');
      }
  
      const etabId = qr.id_user_etablissement_sante;
  
      // 2. 💰 Vérifie le compte de l’utilisateur
      const [compteUtilisateur] = await this.dataSource.query(
        `SELECT * FROM compte WHERE id_user = $1 AND statut = 'actif' LIMIT 1`,
        [idUser],
      );
  
      if (!compteUtilisateur) {
        throw new UnauthorizedException('Compte utilisateur introuvable');
      }
  
      if (compteUtilisateur.solde_compte < montant) {
        throw new BadRequestException('Solde insuffisant');
      }
  
      // 3. 🔄 Débiter et créditer
      const [compteEtablissement] = await this.dataSource.query(
        `SELECT * FROM compte WHERE id_user_etablissement_sante = $1 LIMIT 1`,
        [etabId],
      );
  
      if (!compteEtablissement) {
        throw new NotFoundException('Compte établissement introuvable');
      }
  
      const frais = Math.floor(montant * 0.02); // exemple 2%
      const montantFinal = montant - frais;
  
      // 4. 🔐 Transaction
      await this.dataSource.transaction(async (manager) => {
        // 1. Débit
        await manager.query(
          `UPDATE compte SET solde_compte = solde_compte - $1 WHERE id_compte = $2`,
          [montant, compteUtilisateur.id_compte],
        );
      
        // 2. Crédit
        await manager.query(
          `UPDATE compte SET solde_compte = solde_compte + $1 WHERE id_compte = $2`,
          [montantFinal, compteEtablissement.id_compte],
        );
      
        // 3. Insertion dans transaction_interne D’ABORD
        const insertTransaction = await manager.query(
          `INSERT INTO transaction_interne 
          (id_compte_expediteur, id_compte_recepteur, montant_envoyer, montant_recu, frais_preleve, devise_transaction, statut, type_transaction, id_qrcode_dynamique, id_etablissement_recepteur)
          VALUES ($1, $2, $3, $4, $5, 'XOF', 'effectué', 'paiement_qrcode', $6, $7)
          RETURNING id_transaction`,
          [
            compteUtilisateur.id_compte,
            compteEtablissement.id_compte,
            montant,
            montantFinal, // ✅ montant_recu
            frais,
            qr.id_qrcode,
            etabId,
          ],
        );
        
      
        const idTransaction = insertTransaction[0].id_transaction;
      
        // 4. Ensuite, insertion dans transactions_frais avec id_transaction
        await manager.query(
          `INSERT INTO transactions_frais 
          (id_transaction, montant_frais, type_transaction, mode_paiement)
          VALUES ($1, $2, 'interne', 'wallet')`,
          [idTransaction, frais],
        );
      
        // 5. Invalider QR
        await manager.query(
          `UPDATE qr_code_paiement_dynamique SET statut = 'expiré' WHERE id_qrcode = $1`,
          [qr.id_qrcode],
        );
      });

      // 🔁 Recharge des comptes après transaction
        const [compteUserMaj] = await this.dataSource.query(
          `SELECT solde_compte FROM compte WHERE id_compte = $1`,
          [compteUtilisateur.id_compte],
        );

        const [compteEtabMaj] = await this.dataSource.query(
          `SELECT solde_compte FROM compte WHERE id_compte = $1`,
          [compteEtablissement.id_compte],
        );

      return {
        message: '✅ Paiement effectué avec succès',
        montant_envoyé: montant,
        montant_recu: montantFinal,
        frais_appliqués: frais,
        solde_utilisateur: compteUserMaj.solde_compte,
        solde_etablissement: compteEtabMaj.solde_compte,
      };
    }


    async payerParIdentifiant(identifiant: string, montant: number, idUser: string) {
      if (!identifiant || !montant || !idUser) {
        throw new BadRequestException('Données manquantes');
      }
    
      // 1. 🔍 Trouver l’établissement par email ou téléphone
      const [etab] = await this.dataSource.query(
        `SELECT * FROM user_etablissement_sante 
         WHERE (email = $1 OR telephone = $1) AND compte_verifie = true LIMIT 1`,
        [identifiant],
      );
    
      if (!etab) {
        throw new NotFoundException("Établissement introuvable ou non vérifié");
      }
    
      const etabId = etab.id_user_etablissement_sante;
    
      // 2. 💰 Vérifie le compte de l’utilisateur
      const [compteUtilisateur] = await this.dataSource.query(
        `SELECT * FROM compte WHERE id_user = $1 AND statut = 'actif' LIMIT 1`,
        [idUser],
      );
    
      if (!compteUtilisateur) {
        throw new UnauthorizedException('Compte utilisateur introuvable');
      }
    
      if (compteUtilisateur.solde_compte < montant) {
        throw new BadRequestException('Solde insuffisant');
      }
    
      // 3. 🔄 Compte de l’établissement
      const [compteEtablissement] = await this.dataSource.query(
        `SELECT * FROM compte WHERE id_user_etablissement_sante = $1 LIMIT 1`,
        [etabId],
      );
    
      if (!compteEtablissement) {
        throw new NotFoundException("Compte de l'établissement introuvable");
      }
    
      const frais = Math.floor(montant * 0.02);
      const montantFinal = montant - frais;
    
      // 4. 🔐 Transaction
      await this.dataSource.transaction(async (manager) => {
        // a. Débit
        await manager.query(
          `UPDATE compte SET solde_compte = solde_compte - $1 WHERE id_compte = $2`,
          [montant, compteUtilisateur.id_compte],
        );
      
        // b. Crédit
        await manager.query(
          `UPDATE compte SET solde_compte = solde_compte + $1 WHERE id_compte = $2`,
          [montantFinal, compteEtablissement.id_compte],
        );
      
        // ✅ c. Insérer d’abord dans transaction_interne
        const insertTransaction = await manager.query(
          `INSERT INTO transaction_interne 
          (id_compte_expediteur, id_compte_recepteur, montant_envoyer, montant_recu, frais_preleve, devise_transaction, statut, type_transaction, id_etablissement_recepteur)
          VALUES ($1, $2, $3, $4, $5, 'XOF', 'effectué', 'paiement_contact', $6)
          RETURNING id_transaction`,
          [
            compteUtilisateur.id_compte,
            compteEtablissement.id_compte,
            montant,
            montantFinal, // ✅ montant_recu
            frais,
            etabId,
          ],
        );
        
      
        const idTransaction = insertTransaction[0].id_transaction;
      
        // ✅ d. Insérer dans transactions_frais avec le bon id_transaction
        await manager.query(
          `INSERT INTO transactions_frais 
           (id_transaction, montant_frais, type_transaction, mode_paiement)
           VALUES ($1, $2, 'interne', 'wallet')`,
          [idTransaction, frais],
        );
      });
      
    
      // 5. 🔁 Solde utilisateur MAJ
      const [soldeActuel] = await this.dataSource.query(
        `SELECT solde_compte FROM compte WHERE id_compte = $1`,
        [compteUtilisateur.id_compte],
      );

      const beneficiaire = {
        nom: etab.nom,
        telephone: etab.telephone,
        categorie: etab.categorie,
        email: etab.email,
      };
      

      const [photo] = await this.dataSource.query(
        `SELECT url_image FROM images 
         WHERE id_user_etablissement_sante = $1 AND motif = 'photo_profile' 
         ORDER BY date DESC LIMIT 1`,
        [etab.id_user_etablissement_sante],
      );
      

      
    
      // return {
      //   message: '✅ Paiement effectué avec succès',
      //   identifiant_etablissement: identifiant,
      //   montant_envoyé: montant,
      //   montant_recu: montantFinal,
      //   frais_appliqués: frais,
      //   solde_restant: soldeActuel?.solde_compte || null,
      // };

      return {
        message: '✅ Paiement effectué avec succès',
        identifiant_etablissement: identifiant,
        montant_envoyé: montant,
        montant_recu: montantFinal,
        frais_appliqués: frais,
        solde_restant: soldeActuel?.solde_compte || null,
        beneficiaire,
        photo: photo?.url_image ?? null, // ✅ Valeur sûre

      };
      
    }
    
  }
  