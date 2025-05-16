import { IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  // Exemple d'autres champs d'inscription
  @IsString()
  nom: string;

  @IsString()
  prenom: string;

  @IsString()
  telephone: string;

  @IsString()
  mdp: string;

  @IsOptional()
  @IsString()
  pays?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  code_invitation_utilise?: string;
}

