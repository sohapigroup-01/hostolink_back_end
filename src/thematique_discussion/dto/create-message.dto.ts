import { IsNotEmpty, IsString, IsUUID, IsInt, IsIn, IsOptional } from 'class-validator';

export class CreateMessageDto {
  @IsInt()
  @IsNotEmpty()
  id_thematique_discussion: number;

  @IsUUID()
  @IsNotEmpty()
  id_expediteur: string;

  @IsString()
  @IsNotEmpty()
  contenu: string;

  @IsString()
  @IsIn(['texte', 'image']) // Type de message autorisé
  type_message: string;

  @IsString()
  @IsOptional() // ✅ Ajoute ça
  url_image?: string;
}
