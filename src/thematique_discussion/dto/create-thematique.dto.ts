// src/thematique_discussion/dto/create-thematique.dto.ts
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateThematiqueDto {
  @IsInt()
  @IsNotEmpty()
  id_admin_gestionnaire: number;

  @IsString()
  @IsNotEmpty()
  titre_thematique: string;

  @IsString()
  @IsOptional()
  sous_titre?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  @IsOptional()
  nbre_expert?: number;
}
