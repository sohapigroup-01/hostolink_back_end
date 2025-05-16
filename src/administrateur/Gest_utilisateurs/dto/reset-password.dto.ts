import { IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @MinLength(4) 
  nouveau_mot_de_passe: string;
}
