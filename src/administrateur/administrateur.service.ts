import { Injectable, ConflictException, BadRequestException, NotFoundException, UnauthorizedException, Inject, Get, Query, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Administrateur } from './entities/administrateur.entity';
import { CreateAdministrateurDto } from './dto/create-administrateur.dto';
import { LoginAdministrateurDto } from './dto/login-administrateur.dto';
import { JwtService } from '@nestjs/jwt';
import { Image, ImageMotifEnum } from '../image/entities/image.entity';
import { v2 as cloudinary } from 'cloudinary';
import { DataSource } from 'typeorm';
import { JwtAdminGuard } from 'src/auth/jwt-auth.guard';


@Injectable()
export class AdministrateurService {
  constructor(

    @InjectRepository(Administrateur)
    private readonly adminRepository: Repository<Administrateur>,

    private readonly jwtService: JwtService,
    @Inject('CLOUDINARY') private cloudinaryProvider: typeof cloudinary,

    @InjectRepository(Image) private readonly imageRepository: Repository<Image>,
    private readonly dataSource: DataSource

    
  ) {}

  async inscrireAdministrateur(dto: CreateAdministrateurDto) {
    const existant = await this.adminRepository.findOne({
      where: [{ email: dto.email }, { telephone: dto.telephone }],
    });
    if (existant) throw new ConflictException('Email ou téléphone déjà utilisé.');

    if (!dto.mot_de_passe || dto.mot_de_passe.length < 4) {
      throw new BadRequestException('Le mot de passe doit contenir au moins 4caractères.');
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(dto.mot_de_passe, salt);

    const role = dto.role || 'admin';

    // const administrateur = this.adminRepository.create({
    //   ...dto,
    //   mot_de_passe: hash,
    //   role,
    // });

    const administrateur = this.adminRepository.create({
      email: dto.email,
      telephone: dto.telephone,
      mot_de_passe: hash,
      role,
      nom: dto.nom,
      prenom: dto.prenom,
      adresse: dto.adresse,
      solde_de_rechargement: dto.solde_de_rechargement || 0,
      cumule_des_transactions: dto.cumule_des_transactions || 0,
    });
    
    try {
      const nouvelAdmin = await this.adminRepository.save(administrateur);
      return {
        message: 'Administrateur inscrit avec succès',
        administrateur: {
          id: nouvelAdmin.id_admin_gestionnaire,
          email: nouvelAdmin.email,
          telephone: nouvelAdmin.telephone,
          role: nouvelAdmin.role,
        },
      };
    } catch (error) {
      throw new Error('Une erreur est survenue lors de l’inscription.');
    }
  }

  async connexionAdministrateur(dto: LoginAdministrateurDto) {
    if (!dto.email && !dto.telephone) {
      throw new BadRequestException('Vous devez fournir soit un email, soit un numéro de téléphone.');
    }

    let admin;
    if (dto.email) {
      admin = await this.adminRepository.findOneBy({ email: dto.email });
    } else if (dto.telephone) {
      admin = await this.adminRepository.findOneBy({ telephone: dto.telephone });
    }

    if (!admin) {
      throw new UnauthorizedException('Identifiants incorrects');
    }

    const isPasswordValid = await bcrypt.compare(dto.mot_de_passe, admin.mot_de_passe);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Identifiants incorrects');
    }

    const payload = { id: admin.id_admin_gestionnaire, role: admin.role };
    const token = this.jwtService.sign(payload);

    const fullAdmin = await this.getAdminById(admin.id_admin_gestionnaire);

return {
  message: 'Connexion réussie',
  administrateur: fullAdmin,
  access_token: token,
};

  }

  async getAdminById(id: number) {
    const admin = await this.adminRepository.findOne({
      where: { id_admin_gestionnaire: id },
      select: [
        'id_admin_gestionnaire',
        'email',
        'telephone',
        'role',
        'permissions',
        'statut',
        'dernier_connexion',
        'date_creation',
        'date_modification',
        'nom',
        'prenom',
        'adresse',
        'solde_de_rechargement',
        'cumule_des_transactions',
      ],
    
    });

    if (!admin) {
      throw new NotFoundException('Administrateur non trouvé.');
    }

    const avatar = await this.imageRepository.findOne({
      where: { id_admin_gestionnaire: id, motif: ImageMotifEnum.AVATAR_ADMIN },
    });

    return {
      ...admin,
      avatar_url: avatar ? avatar.url_image : null,
    };

  }

  // ✅ Ajout méthode uploadAvatarAdmin
  async uploadAvatarAdmin(id: number, avatar: Express.Multer.File) {
    const admin = await this.adminRepository.findOneBy({ id_admin_gestionnaire: id });
    if (!admin) throw new NotFoundException('Administrateur non trouvé.');
  
    const uploadResult = await this.cloudinaryProvider.uploader.upload(avatar.path, {
      folder: 'dossier_hostolink_preset/avatars_admin',
      public_id: `admin_${id}_${Date.now()}`,
      overwrite: true,
    });
  
    const ancienneImage = await this.imageRepository.findOne({
      where: { id_admin_gestionnaire: id, motif: ImageMotifEnum.AVATAR_ADMIN },
    });
  
    if (ancienneImage) {
      const ancienneUrl = ancienneImage.url_image;
      const publicId = ancienneUrl?.split('/').pop()?.split('.')[0];
      if (publicId) {
        await this.cloudinaryProvider.uploader.destroy(`avatars_admin/${publicId}`);
      }
      ancienneImage.url_image = uploadResult.secure_url;
      await this.imageRepository.save(ancienneImage);
    } else {
      const nouvelleImage = this.imageRepository.create({
        url_image: uploadResult.secure_url,
        motif: ImageMotifEnum.AVATAR_ADMIN,
        id_admin_gestionnaire: id,
      });
  
      await this.imageRepository.save(nouvelleImage);
    }
  
    return {
      message: 'Avatar administrateur uploadé avec succès',
      url_image: uploadResult.secure_url,
    };
  }

  async supprimerAdministrateur(id: number) {
    const resultat = await this.adminRepository.delete(id);
  
    if (resultat.affected === 0) {
      throw new NotFoundException("Administrateur non trouvé.");
    }
  
    return { message: 'Administrateur supprimé avec succès.' };
  }

  async modifierStatutAdministrateur(id: number, statut: string) {
    const admin = await this.adminRepository.findOneBy({ id_admin_gestionnaire: id });
  
    if (!admin) {
      throw new NotFoundException("Administrateur non trouvé.");
    }
  
    admin.statut = statut;
    await this.adminRepository.save(admin);
  
    return { message: `Statut modifié avec succès en "${statut}".` };
  }
  

  async modifierAdministrateur(id: number, dto: Partial<CreateAdministrateurDto>) {
    const admin = await this.adminRepository.findOneBy({ id_admin_gestionnaire: id });
  
    if (!admin) {
      throw new NotFoundException("Administrateur non trouvé.");
    }
  
    Object.assign(admin, dto, { date_modification: new Date() });
  
    await this.adminRepository.save(admin);
  
    return { message: 'Informations administrateur modifiées avec succès.', admin };
  }
  
  async recupererTousLesAdmins() {
    const [admins, nombre] = await this.adminRepository.findAndCount();
  
    const adminsAvecAvatar = await Promise.all(admins.map(async admin => {
      const avatar = await this.imageRepository.findOne({
        where: { id_admin_gestionnaire: admin.id_admin_gestionnaire, motif: ImageMotifEnum.AVATAR_ADMIN },
      });
  
      return {
        ...admin,
        avatar_url: avatar ? avatar.url_image : null,
      };
    }));
  
    return {
      nombre_admins: nombre,
      administrateurs: adminsAvecAvatar,
    };
  }

  async modifierMotDePasseAdmin(id: number, nouveauMotDePasse: string) {
    if (!nouveauMotDePasse || nouveauMotDePasse.length < 4) {
      throw new BadRequestException('Le mot de passe doit contenir au moins 4 caractères.');
    }
  
    const admin = await this.adminRepository.findOneBy({ id_admin_gestionnaire: id });
  
    if (!admin) {
      throw new NotFoundException("Administrateur non trouvé.");
    }
  
    const hash = await bcrypt.hash(nouveauMotDePasse, await bcrypt.genSalt());
  
    admin.mot_de_passe = hash;
    admin.date_modification = new Date();
  
    await this.adminRepository.save(admin);
  
    return { message: 'Mot de passe modifié avec succès.' };
  }


  async modifierPermissionsAdmin(id: number, permissions: Record<string, any>) {
    const admin = await this.adminRepository.findOneBy({ id_admin_gestionnaire: id });
  
    if (!admin) {
      throw new NotFoundException("Administrateur non trouvé.");
    }
  
    admin.permissions = permissions;
    admin.date_modification = new Date();
  
    await this.adminRepository.save(admin);
  
    return { message: 'Permissions mises à jour avec succès.', permissions };
  }


  async rechercherParRole(role: string) {
    const admins = await this.adminRepository.find({ where: { role } });
  
    const adminsAvecAvatar = await Promise.all(admins.map(async admin => {
      const avatar = await this.imageRepository.findOne({
        where: { id_admin_gestionnaire: admin.id_admin_gestionnaire, motif: ImageMotifEnum.AVATAR_ADMIN },
      });
  
      return {
        ...admin,
        avatar_url: avatar ? avatar.url_image : null,
      };
    }));
  
    return {
      nombre_resultats: admins.length,
      administrateurs: adminsAvecAvatar,
    };
  }
  
   
  

  async crediterUtilisateur(id_user: string, montant: number, idAdmin: number) {
    if (!id_user || !montant || montant <= 0) {
      throw new BadRequestException('ID utilisateur et montant requis');
    }
  
    const [compte] = await this.dataSource.query(
      `SELECT * FROM compte WHERE id_user = $1 AND statut = 'actif' LIMIT 1`,
      [id_user],
    );
    if (!compte) throw new NotFoundException('Compte utilisateur introuvable');
  
    const [admin] = await this.dataSource.query(
      `SELECT * FROM administrateurs WHERE id_admin_gestionnaire = $1 LIMIT 1`,
      [idAdmin]
    );
    if (!admin) throw new NotFoundException("Administrateur non trouvé");
  
    const MAX_AUTORISE = 100000000;
    
    const cumulActuel = parseInt(admin.cumule_des_transactions);
    const soldeActuel = parseInt(admin.solde_de_rechargement);
    
    const nouveauCumul = cumulActuel + montant;
    const nouveauSoldeAdmin = soldeActuel - montant;
    
    if (nouveauCumul > MAX_AUTORISE) {
      throw new BadRequestException("❌ Plafond de 50 000 000 FCFA atteint.");
    }
  
    if (nouveauSoldeAdmin < 0) {
      throw new BadRequestException("❌ Solde de rechargement insuffisant.");
    }
  
    const nouveauSoldeUser = compte.solde_compte + montant;
  
    await this.dataSource.transaction(async manager => {
      await manager.query(
        `UPDATE compte SET solde_compte = $1 WHERE id_compte = $2`,
        [nouveauSoldeUser, compte.id_compte],
      );
  
      await manager.query(
        `UPDATE administrateurs
         SET cumule_des_transactions = $1,
             solde_de_rechargement = $2,
             date_modification = NOW()
         WHERE id_admin_gestionnaire = $3`,
        [nouveauCumul, nouveauSoldeAdmin, idAdmin],
      );
  
      await manager.query(`
        INSERT INTO admin_rechargements 
        (id_admin, cible_type, cible_id, identifiant, montant, ancien_solde, nouveau_solde)
        VALUES ($1, 'user', $2, $3, $4, $5, $6)
      `, [
        idAdmin,
        id_user,
        id_user,
        montant,
        compte.solde_compte,
        nouveauSoldeUser
      ]);
    });

    //console.log("⛏ cumul AVANT :", admin.cumule_des_transactions);
    //console.log("💰 montant :", montant);
    //console.log("🧮 cumul APRÈS :", nouveauCumul);

  
    return {
      message: '✅ Solde crédité avec succès',
      utilisateur: id_user,
      montant_crédité: montant,
    };
  }
  
  
  async crediterEtablissement(idEtab: number, montant: number, idAdmin: number) {
    if (!idEtab || !montant || montant <= 0) {
      throw new BadRequestException('ID établissement et montant requis');
    }
  
    const [compte] = await this.dataSource.query(
      `SELECT * FROM compte 
       WHERE id_user_etablissement_sante = $1 
       AND statut = 'actif' LIMIT 1`,
      [idEtab],
    );
    if (!compte) {
      throw new NotFoundException("Compte établissement introuvable");
    }
  
    const [admin] = await this.dataSource.query(
      `SELECT * FROM administrateurs WHERE id_admin_gestionnaire = $1 LIMIT 1`,
      [idAdmin]
    );
    if (!admin) throw new NotFoundException("Administrateur non trouvé");
  
    const MAX_AUTORISE = 100000000;
    const cumulActuel = parseInt(admin.cumule_des_transactions);
    const soldeActuel = parseInt(admin.solde_de_rechargement);
    
    const nouveauCumul = cumulActuel + montant;
    const nouveauSoldeAdmin = soldeActuel + montant;
    
    if (nouveauCumul > MAX_AUTORISE) {
      throw new BadRequestException("❌ Plafond de 50 000 000 FCFA atteint.");
    }
  
    if (nouveauSoldeAdmin < 0) {
      throw new BadRequestException("❌ Solde de rechargement insuffisant.");
    }
  
    const ancienSolde = compte.solde_compte;
    const nouveauSolde = ancienSolde + montant;
  
    await this.dataSource.transaction(async manager => {
      await manager.query(
        `UPDATE compte 
         SET solde_compte = $1 
         WHERE id_user_etablissement_sante = $2`,
        [nouveauSolde, idEtab],
      );
  
      await manager.query(
        `UPDATE administrateurs
         SET cumule_des_transactions = $1,
             solde_de_rechargement = $2,
             date_modification = NOW()
         WHERE id_admin_gestionnaire = $3`,
        [nouveauCumul, nouveauSoldeAdmin, idAdmin],
      );
  
      await manager.query(`
        INSERT INTO admin_rechargements 
        (id_admin, cible_type, cible_id, identifiant, montant, ancien_solde, nouveau_solde)
        VALUES ($1, 'etablissement', $2, $3, $4, $5, $6)
      `, [
        idAdmin,
        idEtab,
        idEtab.toString(),
        montant,
        ancienSolde,
        nouveauSolde
      ]);
    });

    //console.log("⛏ cumul AVANT :", admin.cumule_des_transactions);
    //console.log("💰 montant :", montant);
    //console.log("🧮 cumul APRÈS :", nouveauCumul);

      
    return {
      message: `✅ Crédit de ${montant} XOF effectué avec succès.`,
      nouveauSolde,
      montant_crédité: montant,
    };
  }
  
  

  async findAllEtablissements(): Promise<{ total: number; etablissements: any[] }> {
    const etabs = await this.dataSource.query(
      `SELECT * FROM user_etablissement_sante ORDER BY id_user_etablissement_sante DESC`,
    );
  
    const etablissements = await Promise.all(
      etabs.map(async (etab) => {
        const [compte] = await this.dataSource.query(
          `SELECT * FROM compte WHERE id_user_etablissement_sante = $1 LIMIT 1`,
          [etab.id_user_etablissement_sante],
        );
  
        const [qrStatique] = await this.dataSource.query(
          `SELECT * FROM qr_code_paiement_statique WHERE id_user_etablissement_sante = $1 LIMIT 1`,
          [etab.id_user_etablissement_sante],
        );
  
        const [qrDynamique] = await this.dataSource.query(
          `SELECT * FROM qr_code_paiement_dynamique 
           WHERE id_user_etablissement_sante = $1 AND statut = 'actif' 
           AND date_expiration > NOW() 
           ORDER BY date_creation DESC LIMIT 1`,
          [etab.id_user_etablissement_sante],
        );
  
        const [image] = await this.dataSource.query(
          `SELECT url_image FROM images 
           WHERE id_user_etablissement_sante = $1 
           AND motif = 'photo_profile' LIMIT 1`,
          [etab.id_user_etablissement_sante],
        );
  
        return {
          ...etab,
          image_profil: image?.url_image || null,
          compte: compte || null,
          qr_code_statique: qrStatique || null,
          qr_code_dynamique: qrDynamique || null,
        };
      }),
    );
  
    return {
      total: etablissements.length,
      etablissements,
    };
  }

  async rechargerUser(identifiant: string, montant: number, idAdmin: number) {
    const [user] = await this.dataSource.query(
      `SELECT * FROM utilisateur WHERE email = $1 OR telephone = $1 LIMIT 1`,
      [identifiant],
    );
    if (!user) throw new NotFoundException("Utilisateur introuvable");
  
    const [compte] = await this.dataSource.query(
      `SELECT * FROM compte WHERE id_user = $1 LIMIT 1`,
      [user.id_user],
    );
    if (!compte) throw new NotFoundException("Compte utilisateur introuvable");
  
    const [admin] = await this.dataSource.query(
      `SELECT * FROM administrateurs WHERE id_admin_gestionnaire = $1 LIMIT 1`,
      [idAdmin]
    );
    if (!admin) throw new NotFoundException("Administrateur non trouvé");
  
    const MAX_AUTORISE = 100000000;
    const cumulActuel = parseInt(admin.cumule_des_transactions);
    const soldeActuel = parseInt(admin.solde_de_rechargement);
    
    const nouveauCumul = cumulActuel + montant;
    const nouveauSoldeAdmin = soldeActuel - montant;
    
    if (nouveauCumul > MAX_AUTORISE) {
      throw new BadRequestException("❌ Plafond de 50 000 000 FCFA atteint.");
    }
  
    if (nouveauSoldeAdmin < 0) {
      throw new BadRequestException("❌ Solde de rechargement insuffisant.");
    }
  
    const nouveauSoldeUser = compte.solde_compte + montant;
  
    // ✅ Exécute tout dans une SEULE transaction
    await this.dataSource.transaction(async manager => {
      await manager.query(
        `UPDATE compte SET solde_compte = $1 WHERE id_user = $2`,
        [nouveauSoldeUser, user.id_user]
      );
  
      await manager.query(
        `UPDATE administrateurs
         SET cumule_des_transactions = $1,
             solde_de_rechargement = $2,
             date_modification = NOW()
         WHERE id_admin_gestionnaire = $3`,
        [nouveauCumul, nouveauSoldeAdmin, idAdmin]
      );
  
      await manager.query(
        `INSERT INTO admin_rechargements (id_admin, cible_type, cible_id, identifiant, montant, ancien_solde, nouveau_solde)
         VALUES ($1, 'user', $2, $3, $4, $5, $6)`,
        [idAdmin, user.id_user, identifiant, montant, compte.solde_compte, nouveauSoldeUser]
      );
    });
  
    return {
      message: '✅ Rechargement utilisateur effectué avec succès',
      nouveauSolde: nouveauSoldeUser,
      montant_crédité: montant
    };
  }
  
  
  async rechargerEtablissement(identifiant: string, montant: number, idAdmin: number) {
    const [etab] = await this.dataSource.query(
      `SELECT * FROM user_etablissement_sante WHERE email = $1 OR telephone = $1 LIMIT 1`,
      [identifiant],
    );
    if (!etab) throw new NotFoundException("Établissement introuvable");
  
    const [compte] = await this.dataSource.query(
      `SELECT * FROM compte WHERE id_user_etablissement_sante = $1 LIMIT 1`,
      [etab.id_user_etablissement_sante],
    );
    if (!compte) throw new NotFoundException("Compte établissement introuvable");
  
    const [admin] = await this.dataSource.query(
      `SELECT * FROM administrateurs WHERE id_admin_gestionnaire = $1 LIMIT 1`,
      [idAdmin]
    );
    if (!admin) throw new NotFoundException("Administrateur non trouvé");
  
    const MAX_AUTORISE = 100000000;
    const cumulActuel = parseInt(admin.cumule_des_transactions);
    const soldeActuel = parseInt(admin.solde_de_rechargement);
    
    const nouveauCumul = cumulActuel + montant;
    const nouveauSoldeAdmin = soldeActuel - montant;
    
    if (nouveauCumul > MAX_AUTORISE) {
      throw new BadRequestException("❌ Plafond de 50 000 000 FCFA atteint.");
    }
  
    if (nouveauSoldeAdmin < 0) {
      throw new BadRequestException("❌ Solde de rechargement insuffisant.");
    }
  
    const nouveauSoldeEtab = compte.solde_compte + montant;
  
    await this.dataSource.transaction(async manager => {
      await manager.query(
        `UPDATE compte SET solde_compte = $1 WHERE id_user_etablissement_sante = $2`,
        [nouveauSoldeEtab, etab.id_user_etablissement_sante]
      );
  
      await manager.query(
        `UPDATE administrateurs
         SET cumule_des_transactions = $1,
             solde_de_rechargement = $2,
             date_modification = NOW()
         WHERE id_admin_gestionnaire = $3`,
        [nouveauCumul, nouveauSoldeAdmin, idAdmin]
      );
  
      await manager.query(
        `INSERT INTO admin_rechargements (id_admin, cible_type, cible_id, identifiant, montant, ancien_solde, nouveau_solde)
         VALUES ($1, 'etablissement', $2, $3, $4, $5, $6)`,
        [
          idAdmin,
          etab.id_user_etablissement_sante,
          identifiant,
          montant,
          compte.solde_compte,
          nouveauSoldeEtab,
        ]
      );
    });
  
    return {
      message: '✅ Rechargement établissement effectué avec succès',
      nouveauSolde: nouveauSoldeEtab,
      montant_crédité: montant
    };
  }
  
  
  // 🔹 Tous les rechargements
  async getAllRechargements() {
    return await this.dataSource.query(`SELECT * FROM admin_rechargements ORDER BY date DESC`);
  }

  // 🔹 Somme des frais (depuis transactions_frais)
  async getTotalFraisTransactions() {
    const result = await this.dataSource.query(`
      SELECT COALESCE(SUM(montant_frais), 0) AS total_frais
      FROM transactions_frais
    `);
    return { total_frais: parseInt(result[0].total_frais, 10) };
  }

  @Get('utilisateur/find')
@UseGuards(JwtAdminGuard)
async findUser(@Query('identifiant') identifiant: string, @Query('type') type: string) {
  if (!identifiant || !type) throw new BadRequestException('Identifiant et type requis');

  let user;

  switch (type.toLowerCase()) {
    case 'email':
      [user] = await this.dataSource.query(`SELECT * FROM utilisateur WHERE email = $1 LIMIT 1`, [identifiant]);
      break;
    case 'uuid':
      [user] = await this.dataSource.query(`SELECT * FROM utilisateur WHERE id_user = $1 LIMIT 1`, [identifiant]);
      break;
    case 'numéro de téléphone':
    case 'téléphone':
    case 'telephone':
      [user] = await this.dataSource.query(`SELECT * FROM utilisateur WHERE telephone = $1 LIMIT 1`, [identifiant]);
      break;
    default:
      throw new BadRequestException('Type de recherche non supporté');
  }

  if (!user) throw new NotFoundException('Utilisateur introuvable');

  const [compte] = await this.dataSource.query(
    `SELECT * FROM compte WHERE id_user = $1 AND statut = 'actif' LIMIT 1`,
    [user.id_user],
  );

  return {
    utilisateur: {
      id: user.id_user,
      email: user.email,
      telephone: user.telephone,
      nom: user.nom,
      image_profil: user.image_profil,
      actif: compte?.statut === 'actif',
      date_inscription: user.date_creation,
    },
  };
}

async rechercherUtilisateurParIdentifiant(identifiant: string, type: string) {
  if (!identifiant || !type) {
    throw new BadRequestException('Identifiant et type requis');
  }

  let query = '';
  switch (type.toLowerCase()) {
    case 'email':
      query = `SELECT * FROM utilisateur WHERE email = $1 LIMIT 1`;
      break;
    case 'numéro de téléphone':
    case 'numero de téléphone':
    case 'téléphone':
    case 'telephone':
      query = `SELECT * FROM utilisateur WHERE telephone = $1 LIMIT 1`;
      break;
    case 'uuid':
      query = `SELECT * FROM utilisateur WHERE id_user = $1 LIMIT 1`;
      break;
    default:
      throw new BadRequestException('Type de recherche non valide');
  }

  const [user] = await this.dataSource.query(query, [identifiant]);

  if (!user) throw new NotFoundException('Utilisateur introuvable');

  return user;
}


async verifierEtMettreAJourAdminTransaction(idAdmin: number, montant: number) {
  const admin = await this.adminRepository.findOneBy({ id_admin_gestionnaire: idAdmin });
  if (!admin) throw new NotFoundException("Administrateur non trouvé");

  const MAX_AUTORISE = 100000000;

  const nouveauCumul = admin.cumule_des_transactions + montant;
  if (nouveauCumul > MAX_AUTORISE) {
    throw new BadRequestException("❌ Plafond de 50 000 000 FCFA atteint. Vous ne pouvez plus effectuer de transaction.");
  }

  if (admin.solde_de_rechargement < montant) {
    throw new BadRequestException("❌ Solde de rechargement insuffisant.");
  }

  admin.cumule_des_transactions = nouveauCumul;
  admin.solde_de_rechargement -= montant;
  admin.date_modification = new Date();

  await this.adminRepository.save(admin);
}

// ------------ RETRAIT DES USERS | E.S

async retirerUtilisateur(id_user: string, montant: number, idAdmin: number) {
  if (!id_user || !montant || montant <= 0) {
    throw new BadRequestException('ID utilisateur et montant requis');
  }

  // Récupérer le compte utilisateur actif
  const [compte] = await this.dataSource.query(
    `SELECT * FROM compte WHERE id_user = $1 AND statut = 'actif' LIMIT 1`,
    [id_user],
  );
  if (!compte) throw new NotFoundException('Compte utilisateur introuvable');

  // Vérifier que l'utilisateur a assez d'argent pour le retrait
  if (compte.solde_compte < montant) {
    throw new BadRequestException("❌ Solde utilisateur insuffisant pour ce retrait.");
  }

  // Récupérer l'administrateur
  const [admin] = await this.dataSource.query(
    `SELECT * FROM administrateurs WHERE id_admin_gestionnaire = $1 LIMIT 1`,
    [idAdmin]
  );
  if (!admin) throw new NotFoundException("Administrateur non trouvé");

  const MAX_AUTORISE = 100000000;
  const cumulActuel = parseInt(admin.cumule_des_transactions);
  const soldeActuel = parseInt(admin.solde_de_rechargement);
  
  const nouveauCumul = cumulActuel + montant;
  const nouveauSoldeAdmin = soldeActuel + montant;
  
  // Vérification du plafond de transaction
  if (nouveauCumul > MAX_AUTORISE) {
    throw new BadRequestException("❌ Plafond de 50 000 000 FCFA atteint.");
  }

  const nouveauSoldeUser = compte.solde_compte - montant;

  // ✅ Mise à jour transactionnelle
  await this.dataSource.transaction(async manager => {
    // Débiter le compte utilisateur
    await manager.query(
      `UPDATE compte SET solde_compte = $1 WHERE id_compte = $2`,
      [nouveauSoldeUser, compte.id_compte],
    );

    // Créditer l'admin et mettre à jour son cumul
    await manager.query(
      `UPDATE administrateurs
       SET cumule_des_transactions = $1,
           solde_de_rechargement = $2,
           date_modification = NOW()
       WHERE id_admin_gestionnaire = $3`,
      [nouveauCumul, nouveauSoldeAdmin, idAdmin],
    );

    // Enregistrer l’opération dans les rechargements (type retrait utilisateur)
    const montantNegatif = -Math.abs(montant);

    await manager.query(`
      INSERT INTO admin_rechargements 
      (id_admin, cible_type, cible_id, identifiant, montant, ancien_solde, nouveau_solde)
      VALUES ($1, 'user', $2, $3, $4, $5, $6)
    `, [
      idAdmin,
      id_user,
      id_user,
      montantNegatif,
      compte.solde_compte,
      nouveauSoldeUser
    ]);

  });

  return {
    message: '✅ Retrait effectué avec succès depuis le compte utilisateur',
    utilisateur: id_user,
    montant_retiré: montant,
  };
}

//  --- RETRIT E.S

async retirerEtablissement(idEtab: number, montant: number, idAdmin: number) {
  if (!idEtab || !montant || montant <= 0) {
    throw new BadRequestException('ID établissement et montant requis');
  }

  // Récupérer le compte de l'établissement
  const [compte] = await this.dataSource.query(
    `SELECT * FROM compte 
     WHERE id_user_etablissement_sante = $1 
     AND statut = 'actif' LIMIT 1`,
    [idEtab],
  );
  if (!compte) {
    throw new NotFoundException("Compte établissement introuvable");
  }

  // Vérifier que l'établissement a assez d'argent pour le retrait
  if (compte.solde_compte < montant) {
    throw new BadRequestException("❌ Solde insuffisant sur le compte de l’établissement.");
  }

  // Récupérer l'administrateur
  const [admin] = await this.dataSource.query(
    `SELECT * FROM administrateurs WHERE id_admin_gestionnaire = $1 LIMIT 1`,
    [idAdmin]
  );
  if (!admin) throw new NotFoundException("Administrateur non trouvé");

  const MAX_AUTORISE = 100000000;
  const cumulActuel = parseInt(admin.cumule_des_transactions);
  const soldeActuel = parseInt(admin.solde_de_rechargement);
  
  const nouveauCumul = cumulActuel + montant;
  const nouveauSoldeAdmin = soldeActuel + montant;
  
  // Vérification du plafond de transaction
  if (nouveauCumul > MAX_AUTORISE) {
    throw new BadRequestException("❌ Plafond de 50 000 000 FCFA atteint.");
  }

  const ancienSolde = compte.solde_compte;
  const nouveauSolde = ancienSolde - montant;

  // ✅ Mise à jour transactionnelle
  await this.dataSource.transaction(async manager => {
    // Débiter l’établissement
    await manager.query(
      `UPDATE compte 
       SET solde_compte = $1 
       WHERE id_user_etablissement_sante = $2`,
      [nouveauSolde, idEtab],
    );

    // Créditer l’admin
    await manager.query(
      `UPDATE administrateurs
       SET cumule_des_transactions = $1,
           solde_de_rechargement = $2,
           date_modification = NOW()
       WHERE id_admin_gestionnaire = $3`,
      [nouveauCumul, nouveauSoldeAdmin, idAdmin],
    );

    // Historique de la transaction (montant négatif)
    const montantNegatif = -Math.abs(montant);

    await manager.query(`
      INSERT INTO admin_rechargements 
      (id_admin, cible_type, cible_id, identifiant, montant, ancien_solde, nouveau_solde)
      VALUES ($1, 'etablissement', $2, $3, $4, $5, $6)
    `, [
      idAdmin,
      idEtab,
      idEtab.toString(),
      montantNegatif,
      ancienSolde,
      nouveauSolde
    ]);

  });

  return {
    message: `✅ Retrait de ${montant} XOF effectué avec succès depuis l’établissement.`,
    nouveauSolde,
    montant_retiré: montant,
  };
}

  
}
