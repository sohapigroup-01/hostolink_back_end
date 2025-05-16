import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class FindNearbyDto {
  @Transform(({ value }) => parseFloat(value))
  @IsNumber({}, { message: 'La latitude doit être un nombre valide.' })
  lat: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber({}, { message: 'La longitude doit être un nombre valide.' })
  lng: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber({}, { message: 'La distance doit être un nombre valide.' })
  @IsPositive({ message: 'La distance doit être un nombre positif supérieur à 0.' })
  distance: number;

  @IsOptional()
  @IsString({ message: 'La catégorie doit être une chaîne de caractères.' })
  categorie?: string; // ⚠️ Ajout essentiel ici
}
