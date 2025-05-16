import { IsNotEmpty,  IsString, Matches } from 'class-validator';

export class FilterListeNumeroVertDto {
  @IsNotEmpty()
  @IsString() //
  @Matches(/^(tous|hopital|clinique|pharmacie)$/, {
    message: "La catégorie doit être 'tous', 'hopital', 'clinique' ou 'pharmacie'.",
  })
  categorie?: string;
}
