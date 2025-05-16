import { IsNotEmpty, IsString, Matches, IsUUID, IsEnum } from 'class-validator';
import { MoyenEnvoiEnum } from '../entities/otp.entity';

// ✅ DTO pour générer un OTP
export class GenerateOtpDto {
  @IsNotEmpty()
  @Matches(/^(\+?[1-9][0-9]{7,14}|[\w-\.]+@([\w-]+\.)+[\w-]{2,4})$/, {
    message: "L'identifiant doit être un email valide ou un numéro de téléphone (8 à 15 chiffres).",
  })
  identifier: string;

  @IsNotEmpty()
  @IsEnum(MoyenEnvoiEnum, { message: "Le moyen d'envoi doit être EMAIL ou TELEPHONE." })
  moyen_envoyer: MoyenEnvoiEnum;
}

// ✅ DTO pour vérifier un OTP
export class VerifyOtpDto {
  @IsNotEmpty()
  @Matches(/^(\+?[1-9][0-9]{7,14}|[\w-\.]+@([\w-]+\.)+[\w-]{2,4})$/, {
    message: "L'identifiant doit être un email valide ou un numéro de téléphone (8 à 15 chiffres).",
  })
  identifier: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{4}$/, { message: "Le code OTP doit être un nombre de 4 chiffres." })
  otpCode: string;

  @IsUUID("4", { message: "L'ID utilisateur doit être un UUID valide." })
  id_user?: string;

  @IsNotEmpty()
  id_user_etablissement_sante?: number;
}
