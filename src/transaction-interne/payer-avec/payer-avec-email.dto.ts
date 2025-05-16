import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

// payer-avec-email.dto.ts
export class PayWithEmailDto {
    @IsNotEmpty()
    @IsString()
    email: string;
        
    @IsNotEmpty()
    @IsNumber()
    montant_envoyer: number;
        
    @IsOptional()
    @IsOptional()
    description?: string;
  }