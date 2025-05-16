// dto/pay-with-phone.dto.ts
import { IsString, IsNumber, IsOptional, Min, Matches } from 'class-validator';

export class PayWithPhoneDto {
  @IsString()
  @Matches(/^\+?[0-9]{8,15}$/, { message: 'Le numéro de téléphone doit être valide' })
  telephone: string;

  @IsNumber()
  @Min(500)
  montant_envoyer: number;

  @IsString()
  @IsOptional()
  description?: string;
}

