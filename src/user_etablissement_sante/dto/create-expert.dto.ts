import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateExpertSanteDto {
  @IsNotEmpty()
  @IsString()
  nom: string;

  @IsNotEmpty()
  @IsString()
  prenom: string;

  @IsNotEmpty()
  @IsString()
  domaine_expertise: string;

  @IsNotEmpty()
  @IsString()
  mot_de_passe: string;
}
