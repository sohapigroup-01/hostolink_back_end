import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateAdministrateurDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  telephone?: string;

  @IsString()
  @MinLength(4)
  @IsOptional()
  mot_de_passe?: string;

  @IsString()
  @IsOptional()
  role?: string;

  @IsString()
  @IsOptional()
  nom_image?: string;
}
