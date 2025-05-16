import { IsInt, IsString, IsIn, IsOptional } from 'class-validator';

export class RepondreMessageExpertDto {
  @IsInt()
  id_thematique_discussion: number;

  @IsInt()
  id_expert: number;

  @IsString()
  contenu: string;

  @IsIn(['texte', 'image'])
  type_message: string;

  @IsOptional()
  @IsString()
  url_image?: string;
}

