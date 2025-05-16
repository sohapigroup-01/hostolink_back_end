import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateListeNumeroVertEtablissementSanteDto {
  @IsOptional()
  @IsString()
  nom_etablissement?: string;

  @IsOptional()
  @IsString()
  contact?: string;

  @IsOptional()
  @IsString()
  presentation?: string;

  @IsOptional()
  @IsString()
  adresse?: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsString()
  type_etablissement?: string;

  @IsOptional()
  @IsString()
  categorie?: string;

  @IsOptional()
  @IsString()
  site_web?: string;

  @IsOptional()
  @IsString()
  image?: string; // L'URL Cloudinary de l'image
}
