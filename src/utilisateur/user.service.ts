import { 
  Injectable, 
  InternalServerErrorException, 
  BadRequestException, 
  NotFoundException, 
  Inject, 
  forwardRef 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Image } from 'src/image/entities/image.entity';
import { ImageMotifEnum } from 'src/image/entities/image.entity';
import { ImageService } from 'src/image/image.service';
import { CompteService } from 'src/compte/compte.service';
import { QrCodeService } from 'src/qr-code/qr-code.service';
import { MoyenEnvoiEnum, Otp } from './entities/otp.entity';
import { EmailService } from './email.service';
import { SmsService } from './sms.service';

@Injectable()
export class UserService {
  AuthService: any;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  
    @Inject(forwardRef(() => ImageService))
    private readonly imageService: ImageService,
  
    @Inject(forwardRef(() => CompteService))
    private readonly compteService: CompteService,
  
    @Inject(forwardRef(() => QrCodeService))
    private readonly qrCodeService: QrCodeService,

    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,

    private readonly emailService: EmailService,
    private readonly smsService: SmsService,



  ) {}
  
  // ✅ Création d'un utilisateur sans mot de passe
  async registerUser(identifier: string,code_invitation_utilise?: string): Promise<{ success: boolean; id_user?: string; message: string; }> {
    try {
      const existingUser = await this.userRepository.findOne({
        where: [{ email: identifier }, { telephone: identifier }],
      });

      if (existingUser) {
        return {
          success: false,
          message: existingUser.email === identifier 
            ? `L'email ${identifier} est déjà utilisé.` 
            : `Le numéro ${identifier} est déjà utilisé.`
        };
      }

      const newUser = this.userRepository.create({
        email: identifier.includes('@') ? identifier : undefined,
        telephone: identifier.includes('@') ? undefined : identifier,
        code_confirmation: Math.floor(1000 + Math.random() * 9000).toString(),
        date_inscription: new Date(),
        code_invitation_utilise: code_invitation_utilise ?? null
      } as Partial<User>);
  
      // if (code_invitation_utilise) {
      //   const invitation = await this.invitationRepository.findOne({
      //     where: { code_invitation: code_invitation_utilise }
      //   });
      
      //   if (invitation) {
      //     //console.log("✅ Parrain trouvé :", invitation.id_user);
      //     newUser.id_parrain = invitation.id_user;
      
      //     // Optionnel : on incrémente les inscriptions
      //     invitation.nombre_inscriptions += 1;
      //     await this.invitationRepository.save(invitation);
      //   }
      // }
      
      // ✅ Seulement maintenant tu fais le save
      const savedUser = await this.userRepository.save(newUser);
  
      // ✅ Créer automatiquement un compte pour le nouvel utilisateur
      await this.compteService.createUserCompte(savedUser.id_user);
      
      // ✅ Créer automatiquement un QR code statique pour le nouvel utilisateur
      await this.qrCodeService.createStaticQrForNewUser(savedUser.id_user);



      // ✅ Créer automatiquement un QR code dynamique avec une durée de 60s
      await this.qrCodeService.createDynamicQrForUser(savedUser.id_user,); // 60 secondes


      return { success: true, id_user: savedUser.id_user, message: "Utilisateur inscrit, redirection vers la définition du mot de passe." };
    } catch (error) {
      throw new InternalServerErrorException("Erreur lors de l'inscription: " + error.message);
    }
  }

  // ✅ Définition d'un mot de passe sécurisé
  async setUserPassword(identifier: string, password: string): Promise<{ success: boolean; message: string }> {
    if (!password.trim()) {
      return { success: false, message: "Le mot de passe ne peut pas être vide." };
    }

    const user = await this.userRepository.findOne({
      where: [{ email: identifier }, { telephone: identifier }],
    });

    if (!user) {
      throw new BadRequestException(`L'identifiant ${identifier} est incorrect.`);
    }

    user.mdp = await bcrypt.hash(password.trim(), 10);
    await this.userRepository.save(user);

    return { success: true, message: "Mot de passe défini avec succès." };
  }

  // ✅ Récupération des informations utilisateur avec l'image de profil et le compte
  async getUserById(id_user: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { id_user } });

    if (!user) {
      throw new NotFoundException("Utilisateur introuvable");
    }

    // Récupération de l'image de profil depuis la table images
    const profileImage = await this.imageRepository.findOne({
      where: { id_user, motif: ImageMotifEnum.PROFILE },
      order: { date: 'DESC' }
    });
    
    // Récupération des informations du compte de l'utilisateur
    const compte = await this.compteService.getUserCompte(id_user);
    const qrcodedynamique = await this.qrCodeService.getUserDynamicQrCodes(id_user);
    const qrcodedstatique = await this.qrCodeService.getUserStaticQrCode(id_user);
    const allqrcodes = await this.qrCodeService.getAllUserQrCodes(id_user);

    return { 
      ...user, 
      mdp: user.mdp,
      photo_profile: profileImage ? profileImage.url_image : 'https://res.cloudinary.com/dhrrk7vsd/image/upload/v1745581355/hostolink/default_icone_pyiudn.png',
      compte,
      qrcodedynamique,
      qrcodedstatique,
      allqrcodes,
    };
  }

  async generateOtp(identifier: string, moyen_envoyer: MoyenEnvoiEnum): Promise<{ success: boolean; otp: string }> {
    try {
      identifier = identifier.trim();
      const user = await this.userRepository.findOne({
        where: [{ email: identifier }, { telephone: identifier }],
      });
  
      if (!user || !user.id_user) {
        console.error(`❌ Échec : Utilisateur invalide ou introuvable pour ${identifier}`);
        throw new BadRequestException("Utilisateur invalide ou introuvable");
      }
  
      // ✅ Générer un OTP (4 chiffres)
      const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
  
      // ✅ Définir l'expiration à 5 minutes
      const expirationDate = new Date();
      expirationDate.setMinutes(expirationDate.getMinutes() + 5);
  
      // ✅ Créer le nouvel OTP
      const otp = this.otpRepository.create({
        otp_code: otpCode,
        expires_at: expirationDate,
        is_valid: true,
        moyen_envoyer,
        user,
        id_user_etablissement_sante: undefined,
      });
  
      // ✅ Sauvegarder d'abord le nouvel OTP
      await this.otpRepository.save(otp);
  
      // ✅ Supprimer tous les anciens OTP de ce user (sauf celui-ci)
      await this.otpRepository.createQueryBuilder()
        .delete()
        .from(Otp)
        .where("id_user = :id_user AND otp_code != :code", {
          id_user: user.id_user,
          code: otpCode,
        })
        .execute();
  
      // ✅ Envoi de l'OTP uniquement si EMAIL
      if (moyen_envoyer === MoyenEnvoiEnum.EMAIL) {
        if (!user.email) {
          throw new BadRequestException("Impossible d'envoyer l'OTP : aucun email renseigné.");
        }
  
        await this.emailService.sendOtpEmail(user.email, otpCode);
        //console.log(`📤 EMAIL envoyé à ${user.email} avec OTP ${otpCode}`);
      }
  
      if (moyen_envoyer === MoyenEnvoiEnum.SMS) {
        if (!user.telephone) {
          throw new BadRequestException("Impossible d'envoyer l'OTP : aucun numéro de téléphone renseigné.");
        }

        await this.smsService.sendOtpSms(user.telephone, otpCode);
        console.log(`📲 SMS envoyé à ${user.telephone} avec OTP ${otpCode}`);
      }
      return { success: true, otp: otpCode };
  
    } catch (error) {
      console.error("❌ Erreur dans generateOtp :", error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException("Erreur lors de la génération de l'OTP");
    }
  }

  async generateJwtToken(user: User): Promise<string> {
    return this.AuthService.sign({
      id_user: user.id_user,
      email: user.email,
      telephone: user.telephone,
    });
  }
  
  
    
  
    // verif otp
    async verifyOtp(identifier: string, otpCode: string): Promise<{ success: boolean; message: string }> {
      try {
        identifier = identifier.trim();
        otpCode = otpCode.trim();
    
        const user = await this.userRepository.findOne({
          where: [{ email: identifier }, { telephone: identifier }],
        });
    
        if (!user) {
          console.warn(`❌ Utilisateur non trouvé pour ${identifier}`);
          return { success: false, message: "Utilisateur non trouvé" };
        }
    
        const otp = await this.otpRepository.findOne({
          where: {
            user: { id_user: user.id_user }, 
            otp_code: otpCode, 
            is_valid: true 
          },
          relations: ['user'], 
        });
    
        if (!otp) {
          console.warn(`❌ Aucun OTP valide trouvé pour ${identifier} avec code ${otpCode}`);
          return { success: false, message: "Code OTP incorrect ou expiré" };
        }
        // ✅ Vérification et mise à jour du champ compte_verifier
        if (!user.compte_verifier) {
        user.compte_verifier = true;
        await this.userRepository.save(user);
        //console.log(`✅ Le compte ${identifier} est maintenant vérifié.`);  
      }

    
        // ✅ Vérifier si l'OTP est expiré
        if (new Date() > otp.expires_at) {
          otp.is_valid = false;
          await this.otpRepository.save(otp);
          console.warn(`❌ Code OTP expiré pour ${identifier}`);
          return { success: false, message: "Code OTP expiré" };
        }
    
        // ✅ Désactiver l'OTP après validation
        otp.is_valid = false;
        await this.otpRepository.save(otp);
    
        //console.log(`✅ Code OTP validé avec succès pour ${identifier}`);
        return { success: true, message: "Code OTP valide" };
    
      } catch (error) {
        console.error("❌ Erreur lors de la vérification de l'OTP :", error);
        throw new InternalServerErrorException("Erreur lors de la vérification de l'OTP");
      }
    }
    

  // ✅ Mise à jour du profil utilisateur avec gestion d'image
  async updateUserProfile(id_user: string, updateProfileDto: UpdateProfileDto, file?: Express.Multer.File) {
    const user = await this.userRepository.findOne({ where: { id_user } });
    if (!user) {
      throw new NotFoundException("Utilisateur introuvable.");
    }

    if (!Object.keys(updateProfileDto).length && !file) {
      throw new BadRequestException("Aucune donnée à mettre à jour.");
    }

    // ✅ Si une nouvelle image est envoyée, on supprime l'ancienne et on ajoute la nouvelle
    let profileImageUrl: string | null = null;
    if (file) {
      const uploadedImage = await this.imageService.uploadImage(file, id_user, ImageMotifEnum.PROFILE);
      profileImageUrl = uploadedImage?.url_image ?? null;
    }

    // ✅ Mettre à jour les autres informations utilisateur
    await this.userRepository.update(id_user, updateProfileDto as Partial<User>);

    return { 
      success: true, 
      message: "Profil mis à jour avec succès."
    };
  }

// ✅ Trouve un utilisateur par email ou téléphone A ECRIS SON ENDPOINT 
async findUserByIdentifier(identifier: string): Promise<User | null> {
  return await this.userRepository.findOne({
    where: [{ email: identifier }, { telephone: identifier }],
  });
}

// ✅ Vérifier un code OTP et activer le compte
async verifyConfirmationCode(identifier: string, code: string): Promise<boolean> {
  identifier = identifier.trim();
  code = code.trim();

  const user = await this.userRepository.findOne({
    where: [{ email: identifier }, { telephone: identifier }],
  });

  // 🚨 Vérification si l'utilisateur existe
  if (!user) {
    throw new Error('Utilisateur non trouvé');
  }

  user.compte_verifier = true;
  await this.userRepository.save(user);

  return true;
}


  // ✅ Mettre compte_verifier = true
  async updateUserVerificationStatus(identifier: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: [{ email: identifier }, { telephone: identifier }],
    });

    if (user) {
      user.compte_verifier = true;
      await this.userRepository.save(user);
    }
  }

  // ✅ Vérifie un PIN de connexion (mot de passe)
  async verifyUserPin(identifier: string, pin: string): Promise<boolean> {
    identifier = identifier.trim();
    pin = pin.trim();

    //console.log(`🔐 Vérification du PIN pour ${identifier}`);

    const user = await this.userRepository.findOne({
      where: [{ email: identifier }, { telephone: identifier }],
    });

    if (!user || !user.mdp) {
      console.warn(`⚠️ Échec de la vérification PIN : utilisateur introuvable ou mot de passe manquant.`);
      return false;
    }

    const isValid = await bcrypt.compare(pin, user.mdp);

    if (isValid) {
      //console.log(`✅ PIN correct pour ${identifier}`);
    } else {
      console.warn(`❌ PIN incorrect pour ${identifier}`);
    }

    return isValid;
  }

  async generateAndSendOtp(user: User): Promise<void> {
    const identifier = user.email ?? user.telephone;
    const moyen = user.email ? MoyenEnvoiEnum.EMAIL : MoyenEnvoiEnum.SMS;
    await this.generateOtp(identifier!, moyen);
  }



// Méthode à ajouter au UserService
  async findUserByPhone(telephone: string) {
    const user = await this.userRepository.findOne({
      where: { telephone, compte_verifier: true, actif: true }
    });
    
    if (!user) {
      throw new NotFoundException(`Aucun utilisateur trouvé avec le numéro ${telephone}`);
    }
    
    return user;
  }
  
  // 💸 Récompenser le parrain après vérification OTP de l'invité
// async rewardParrainAfterOtp(user: User) {
//   try {
//     if (!user.id_parrain) {
//       //console.log("❌ Aucun parrain associé à cet utilisateur.");
//       return;
//     }

//     // Récupérer le compte du parrain
//     const compteParrain = await this.compteService.getUserCompte(user.id_parrain);
//     if (!compteParrain) {
//       console.warn("❌ Compte parrain introuvable.");
//       return;
//     }

//     // Ajouter le bonus de parrainage
//     const montantBonus = 500;
//     const nouveauSolde = compteParrain.solde_bonus + montantBonus;

//     await this.compteService.updateCompteBonus(compteParrain.id_compte, nouveauSolde);

//     //console.log(`✅ Bonus de ${montantBonus} F crédité au parrain : ${user.id_parrain}`);
//   } catch (error) {
//     console.error("❌ Erreur rewardParrainAfterOtp:", error);
//   }
// }
// apres verification de l otp du nouveau utilisateur referer par l utilisateur
async verifyOtpAndRewardParrain(identifier: string, otpCode: string): Promise<{ success: boolean; message: string }> {
  try {
    const user = await this.userRepository.findOne({
      where: [{ email: identifier }, { telephone: identifier }],
    });

    if (!user) {
      return { success: false, message: "Utilisateur non trouvé" };
    }

    const otp = await this.otpRepository.findOne({
      where: {
        user: { id_user: user.id_user },
        otp_code: otpCode,
        is_valid: true
      },
      relations: ['user'],
    });

    if (!otp) {
      return { success: false, message: "Code OTP incorrect ou expiré" };
    }

    if (new Date() > otp.expires_at) {
      otp.is_valid = false;
      await this.otpRepository.save(otp);
      return { success: false, message: "Code OTP expiré" };
    }

    // ✅ Activer le compte
    if (!user.compte_verifier) {
      user.compte_verifier = true;
      await this.userRepository.save(user);
    }

    // ✅ Désactiver l'OTP
    otp.is_valid = false;
    await this.otpRepository.save(otp);

    // ✅ Récompenser le parrain si existe
    // if (user.id_parrain) {
    //   const compteParrain = await this.compteService.getUserCompte(user.id_parrain);
    //   if (compteParrain) {
    //     const montantBonus = 500;
    //     const nouveauBonus = compteParrain.solde_bonus + montantBonus;
    //     await this.compteService.updateCompteBonus(compteParrain.id_compte, nouveauBonus);
    //     //console.log(`✅ Parrain ${user.id_parrain} a reçu ${montantBonus} F de bonus`);
    //   }
    // }

    return { success: true, message: "OTP vérifié et bonus parrain appliqué si existant." };

  } catch (error) {
    console.error("❌ Erreur verifyOtpAndRewardParrain:", error);
    throw new InternalServerErrorException("Erreur OTP + bonus");
  }
}



  // ✅ Récupérer tous les emails actifs et vérifiés
async getAllEmails() {
  const users = await this.userRepository.find({
    select: ['email'],
    where: { actif: true, compte_verifier: true },
  });

  return users
    .filter(user => user.email)
    .map(user => user.email);
}

// ✅ Récupérer tous les téléphones actifs et vérifiés
async getAllTelephones() {
  const users = await this.userRepository.find({
    select: ['telephone'],
    where: { actif: true, compte_verifier: true },
  });

  return users
    .filter(user => user.telephone)
    .map(user => user.telephone);
}

  
}