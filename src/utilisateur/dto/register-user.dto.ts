import { IsNotEmpty, IsString, Matches, MinLength, IsOptional, IsUUID } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^(\+?[1-9][0-9]{7,14}|[\w-\.]+@([\w-]+\.)+[\w-]{2,4})$/, {
    message: "L'identifiant doit être un email valide ou un numéro de téléphone (8 à 15 chiffres)",
  })
  identifier: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4, { message: "Le mot de passe doit contenir au moins 4 caractères" })
  password: string;

  @IsOptional()
  @IsUUID()
  id_user?: string;
}
