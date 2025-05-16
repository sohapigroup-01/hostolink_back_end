import { IsNotEmpty, Matches, IsOptional, IsUUID, IsString } from 'class-validator';

export class CheckUserDto {
  @IsNotEmpty()
  @Matches(/^(\+?[1-9][0-9]{7,14}|[\w-\.]+@([\w-]+\.)+[\w-]{2,4})$/, {
    message: "L'identifiant doit être un email valide ou un numéro de téléphone (8 à 15 chiffres)",
  })
  identifier: string;

  @IsOptional()
  @IsUUID()
  id_user?: string;

  @IsOptional()
  @IsString()
  code_invitation_utilise?: string;

}
