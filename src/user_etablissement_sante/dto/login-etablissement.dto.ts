import { IsNotEmpty } from "class-validator";

export class LoginEtablissementDto {
  @IsNotEmpty()
  identifiant: string; // email ou téléphone

  @IsNotEmpty()
  mot_de_passe: string;
}
