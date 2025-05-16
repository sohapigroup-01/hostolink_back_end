// src/compte/dto/update-solde.dto.ts
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateSoldeDto {
  @IsNotEmpty()
  @IsNumber()
  montant: number;
}