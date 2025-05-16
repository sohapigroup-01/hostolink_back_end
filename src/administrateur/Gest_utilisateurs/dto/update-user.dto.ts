import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()  // ✅ Permet d'éviter l'erreur si ce champ est absent
  @IsString()    // ✅ Vérifie que c'est bien une chaîne de caractères
  raison_banni?: string;
}
