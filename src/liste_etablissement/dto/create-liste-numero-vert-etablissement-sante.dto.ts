import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, IsNumber, IsInt, IsEnum } from 'class-validator';


export class CreateListeNumeroVertEtablissementSanteDto {
  @IsInt()
  @Type(() => Number) 
  id_admin_gestionnaire?: number;

  @IsNotEmpty()
  @IsString()
  contact: string;

  @IsOptional()
  @IsString()
  image?: string; // ✅ Image doit être une chaîne

  @IsOptional()
  @IsString()
  nom_etablissement?: string;

  @IsOptional()
  @IsString()
  presentation?: string;

  @IsOptional()
  @IsString()
  adresse?: string;

  @IsOptional()
  latitude?: number;

  @IsOptional()
  longitude?: number;

  @IsOptional()
  @IsString()
  site_web?: string;
  
  @IsString()
  @IsNotEmpty()
  type_etablissement: string;

  @IsNotEmpty()
  @IsString()
  categorie: string;

}
