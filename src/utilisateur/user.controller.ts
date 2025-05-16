import { Controller, Post, Body, BadRequestException, InternalServerErrorException, Get, UseGuards,  Req, 
  Patch, 
  UploadedFile, 
  UseInterceptors, 
  NotFoundException} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { CheckUserDto } from './dto/check-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { MoyenEnvoiEnum } from './entities/otp.entity';
import { AuthService } from 'src/auth/auth.service';

interface AuthenticatedRequest extends Request {
  user: { id_user: string };
}

@Controller('api')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  // ✅ Création d'un utilisateur (sans mot de passe)
  @Post('register-user')
  async registerUser(@Body() checkUserDto: CheckUserDto) {
    try {
      const result = await this.userService.registerUser(checkUserDto.identifier.trim(),checkUserDto.code_invitation_utilise?.trim());
      return { success: result.success, id_user: result.id_user, message: result.message };
    } catch (error) {
      console.error('❌ Erreur register-user:', error);
      throw new InternalServerErrorException(error.message || "Erreur lors de l'inscription");
    }
  }

  // ✅ Définition du mot de passe après inscription
// ✅ Définition du mot de passe + génération immédiate d'un OTP
@Post('define-password')
async definePassword(@Body() registerUserDto: RegisterUserDto) {
  const identifier = registerUserDto.identifier?.trim();
  const password = registerUserDto.password?.trim();

  if (!identifier || !password) {
    throw new BadRequestException('Identifiant et mot de passe sont obligatoires');
  }

  try {
    const success = await this.userService.setUserPassword(identifier, password);

    if (!success) {
      throw new InternalServerErrorException("Échec de la mise à jour du mot de passe.");
    }

    // ✅ Déterminer si c'est un email ou un téléphone
    const moyen: MoyenEnvoiEnum = identifier.includes('@') ? MoyenEnvoiEnum.EMAIL : MoyenEnvoiEnum.SMS;

    // ✅ Générer automatiquement un OTP
    const { otp } = await this.userService.generateOtp(identifier, moyen);

    // ✅ Retourner la réponse
    return {
      success: true,
      message: `Mot de passe défini. Un OTP a été envoyé via ${moyen}.${otp}`,
      // otp: moyen === MoyenEnvoiEnum.SMS ? otp : undefined, // on affiche le code uniquement si SMS
    };

  } catch (error) {
    console.error("❌ Erreur define-password:", error);
    throw new InternalServerErrorException(error.message || "Erreur lors de la mise à jour du mot de passe");
  }
}


  // ✅ Vérification du PIN de connexion
  @Post('verify-pin')
    async verifyPin(@Body() body: { identifier: string; pin: string }) {
      if (!body.identifier?.trim() || !body.pin?.trim()) {
        throw new BadRequestException('Identifiant et PIN requis');
      }

      try {
        const isValid = await this.userService.verifyUserPin(
          body.identifier.trim(), 
          body.pin.trim()
        );
        
        return isValid 
          ? { success: true, message: 'PIN valide' } 
          : { success: false, message: 'PIN incorrect' };
      } catch (error) {
        console.error("❌ Erreur verify-pin:", error);
        throw new InternalServerErrorException("Erreur lors de la vérification du PIN");
      }
  }
  
  @Post('verify')
  async verifyOtp(@Body() body: { identifier: string; otpCode: string }) {
    if (!body.identifier?.trim() || !body.otpCode?.trim()) {
      throw new BadRequestException("Identifiant et code OTP requis");
    }
  
    try {
      const identifier = body.identifier.trim();
      const otpCode = body.otpCode.trim();
  
      //console.log(`📩 Vérification OTP pour ${identifier}`);
  
      const result = await this.userService.verifyOtp(identifier, otpCode);
  
      if (!result.success) return result;
  
      const user = await this.userService.findUserByIdentifier(identifier);
      if (!user) throw new NotFoundException("Utilisateur introuvable.");
  
      const token = await this.authService.generateJwtTokenFromUser(user);
  
      return {
        success: true,
        message: result.message,
        token, // ✅ maintenant le front Flutter pourra rediriger
      };
    } catch (error) {
      console.error("❌ Erreur verify-otp:", error);
      return { success: false, message: "Échec de la vérification de l'OTP" };
    }
  }
  
  


    @Post('generate')
    async generateOtp(@Body() body: { identifier: string; moyen_envoyer: MoyenEnvoiEnum }) {
      if (!body.identifier?.trim()) {
        throw new BadRequestException("L'identifiant est requis");
      }
    
      try {
        const moyenEnvoyerFormatted = body.moyen_envoyer.toLowerCase() as MoyenEnvoiEnum;
        //console.log(`📩 Génération OTP pour ${body.identifier} via ${moyenEnvoyerFormatted}`);
    
        const { otp } = await this.userService.generateOtp(body.identifier.trim(), moyenEnvoyerFormatted);
    
        // 🔵 Si c'est un téléphone ➔ afficher simplement le code
        if (moyenEnvoyerFormatted === MoyenEnvoiEnum.SMS || moyenEnvoyerFormatted === MoyenEnvoiEnum.TELEPHONE) {
          return {
            success: true,
            message: "OTP généré avec succès (affiché uniquement en mode SMS)",
            moyen: moyenEnvoyerFormatted,
            otp, // ✅ affiché dans la réponse
          };
        }
    
        // 🟣 Email → envoyer normalement (tu peux garder l’envoi réel si tu veux)
        return {
          success: true,
          message: "OTP envoyé par email avec succès",
          moyen: moyenEnvoyerFormatted,
          otp
        };
      } catch (error) {
        console.error("❌ Erreur generate-otp:", error);
        throw new InternalServerErrorException(error.message || "Erreur lors de la génération de l'OTP");
      }
    }
    
    

  // ✅ Récupérer les infos de l'utilisateur connecté
  @Get('user/me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: AuthenticatedRequest) {
    const user = await this.userService.getUserById(req.user.id_user);
    
    return {
      success: true,
      data: user,
    };
  }
  
  @Patch('/update-profile')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async updateProfile(
    @Req() req: AuthenticatedRequest, 
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const id_user = req.user.id_user; // 🔥 récupéré du token, pas du body
    //console.log('🟢 Image reçue:', file ? file.originalname : 'Aucune image reçue');
    //console.log('🔵 id_user extrait du token:', id_user);
  
    return await this.userService.updateUserProfile(id_user, updateProfileDto, file);
  }
  

// ✅ Récupérer tous les emails
@Get('all-emails')
@UseGuards(JwtAuthGuard)
async getAllEmails(@Req() req: AuthenticatedRequest) {
  return await this.userService.getAllEmails();
}

// ✅ Récupérer tous les téléphones
@Get('all-telephones')
@UseGuards(JwtAuthGuard)
async getAllTelephones(@Req() req: AuthenticatedRequest) {
  return await this.userService.getAllTelephones();
}

// ✅ Vérifier si un email ou numéro existe
@Post('check-identifier')
@UseGuards(JwtAuthGuard)
async checkIdentifier(@Req() req: AuthenticatedRequest, @Body() body: { identifier: string }) {
  if (!body.identifier?.trim()) {
    throw new BadRequestException("Identifiant requis.");
  }

  const user = await this.userService.findUserByIdentifier(body.identifier.trim());
  if (user) {
    return { success: true, message: "Identifiant trouvé", data: user };
  } else {
    return { success: false, message: "Identifiant non trouvé" };
  }

  // ✅ Création d'un utilisateur avec code d'invitation (si fourni)
// @Post('check-user')
//   async checkUser(@Body() body: { identifier: string; code_invitation_utilise?: string }) {
//     return this.userService.registerUser(
//       body.identifier.trim(),
//       body.code_invitation_utilise?.trim() // ← C’EST ICI QUE ÇA PEUT ÊTRE VIDE
//     );
// }

// @Post('verify-otp-bonus')
//   async verifyOtpAndReward(@Body() body: { identifier: string; otpCode: string }) {
//   if (!body.identifier?.trim() || !body.otpCode?.trim()) {
//     throw new BadRequestException("Identifiant et code OTP requis");
// }

//   try {
//     const result = await this.userService.verifyOtpAndRewardParrain(
//       body.identifier.trim(),
//       body.otpCode.trim()
//     );
//     return result;
//   } catch (error) {
//     console.error("❌ Erreur verify-otp-bonus:", error);
//     throw new InternalServerErrorException(error.message || "Erreur lors de la vérification OTP + bonus");
//   }
// }


}
}
