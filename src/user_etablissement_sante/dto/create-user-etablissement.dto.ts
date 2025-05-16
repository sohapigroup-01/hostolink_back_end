import { IsNotEmpty, IsString, IsEmail, IsNumber } from 'class-validator';

export class CreateUserEtablissementDto {
  @IsString()
  @IsNotEmpty()
  nom: string;

  @IsString()
  @IsNotEmpty()
  telephone: string;

  @IsString()
  @IsNotEmpty()
  categorie: string;

  @IsString()
  @IsNotEmpty()
  adresse: string;

  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @IsNumber()
  @IsNotEmpty()
  longitude: number;

  @IsString()
  @IsNotEmpty()
  specialites: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  mot_de_passe: string;
}
