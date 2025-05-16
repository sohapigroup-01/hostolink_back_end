import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Compte, TypeUserEnum } from './entitie/compte.entity';

@Injectable()
export class CompteService {
  constructor(
    @InjectRepository(Compte)
    private readonly compteRepository: Repository<Compte>,
  ) {}

  /**
   * Crée un compte utilisateur automatiquement
   * @param id_user UUID de l'utilisateur
   * @returns Le compte créé
   */
  async createUserCompte(id_user: string): Promise<Compte> {
    // Vérifier si un compte existe déjà pour cet utilisateur
    const existingCompte = await this.compteRepository.findOne({ where: { id_user } });
    
    if (existingCompte) {
      // Un compte existe déjà, donc on le retourne simplement
      //console.log(`Un compte existe déjà pour l'utilisateur ${id_user}`);
      return existingCompte;
    }
    
    // Génère un numéro de compte de format USER-XXXX-XXXX-XXXX
    const numeroCompte = `USER-${this.generateAccountNumber()}`;
    
    const newCompte = this.compteRepository.create({
      id_user,
      type_user: TypeUserEnum.UTILISATEUR,  // Utiliser l'énumération au lieu d'une chaîne de caractères
      numero_compte: numeroCompte,
      solde_compte: 0,
      solde_bonus: 0,
      cumule_mensuel: 0,
      plafond: 0, // Valeur par défaut
      devise: 'XOF',
      statut: 'actif',
      date_creation_compte: new Date(),
      date_modification: new Date(),
    });

    return this.compteRepository.save(newCompte);
  }

  /**
   * Récupère le compte d'un utilisateur
   * @param id_user UUID de l'utilisateur
   * @returns Le compte de l'utilisateur ou null si aucun compte n'existe
   */
  async getUserCompte(id_user: string): Promise<Compte | null> {
    return this.compteRepository.findOne({ where: { id_user } });
  }

  /**
   * Génère un numéro de compte aléatoire au format XXXX-XXXX-XXXX
   */
  private generateAccountNumber(): string {
    // Utilise UUID pour générer un identifiant unique et prend les 12 premiers caractères
    const uuid = uuidv4().replace(/-/g, '').substring(0, 12);
    
    // Formate en XXXX-XXXX-XXXX
    return `${uuid.substring(0, 4)}-${uuid.substring(4, 8)}-${uuid.substring(8, 12)}`;
  }
  
  // 📁 src/compte/compte.service.ts

  async updateCompteBonus(id_compte: number, nouveauSoldeBonus: number): Promise<void> {
    await this.compteRepository.update(id_compte, {
      solde_bonus: nouveauSoldeBonus,
      date_modification: new Date()
    });
  }
  


  async créditerBonusParrain(id_parrain: string, montant: number = 500): Promise<void> {
    const compte = await this.compteRepository.findOne({ where: { id_user: id_parrain } });
  
    if (!compte) {
      throw new NotFoundException(`Parrain avec id_user=${id_parrain} introuvable.`);
    }
  
    compte.solde_bonus += montant;
    compte.solde_compte += montant; // Optionnel : visible comme crédit réel
    compte.date_modification = new Date();
  
    await this.compteRepository.save(compte);
  }
  
  /* 
   * CODE POUR LES ÉTABLISSEMENTS DE SANTÉ (À IMPLÉMENTER PLUS TARD)
   * Décommentez ce code quand le module d'établissement de santé sera développé
   */
  /*
  async createEtablissementCompte(id_user_etablissement_sante: number): Promise<Compte> {
    // Vérifier si un compte existe déjà pour cet établissement
    const existingCompte = await this.compteRepository.findOne({ 
      where: { id_user_etablissement_sante } 
    });
    
    if (existingCompte) {
      // Un compte existe déjà, donc on le retourne simplement
      //console.log(`Un compte existe déjà pour l'établissement ${id_user_etablissement_sante}`);
      return existingCompte;
    }
    
    // Génère un numéro de compte de format ETAB-XXXX-XXXX-XXXX
    const numeroCompte = `ETAB-${this.generateAccountNumber()}`;
    
    const newCompte = this.compteRepository.create({
      id_user_etablissement_sante,
      type_user: TypeUserEnum.ETABLISSEMENT,  // Utiliser l'énumération au lieu d'une chaîne de caractères
      numero_compte: numeroCompte,
      solde_compte: 0,
      solde_bonus: 0,
      cumule_mensuel: 0,
      plafond: 500000, // Plafond plus élevé pour les établissements
      devise: 'XOF',
      statut: 'actif',
      date_creation_compte: new Date(),
      date_modification: new Date(),
    });

    return this.compteRepository.save(newCompte);
  }

  async getEtablissementCompte(id_user_etablissement_sante: number): Promise<Compte | null> {
    return this.compteRepository.findOne({ where: { id_user_etablissement_sante } });
  }
  */
}