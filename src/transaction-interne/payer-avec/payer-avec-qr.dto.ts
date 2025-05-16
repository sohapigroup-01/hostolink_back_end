// dto/pay-with-qr.dto.ts
import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class PayWithQrDto {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @IsNumber()
  montant_envoyer: number;

  @IsOptional()
  @IsString()
  description?: string;
}
