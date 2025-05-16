import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  otp_code: string;

  @IsNotEmpty()
  @MinLength(4)
  nouveau_mot_de_passe: string;
}
