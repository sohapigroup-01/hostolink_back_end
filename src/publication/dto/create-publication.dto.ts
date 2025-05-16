
import { IsString, IsOptional, IsInt, IsNotEmpty } from 'class-validator';

export class CreatePublicationDto {
    @IsString()
    @IsNotEmpty()
    titre_publication: string;

    @IsString()
    @IsNotEmpty()
    contenu: string;

    @IsOptional()
    @IsString()
    image?: string; 

    @IsInt()
    @IsNotEmpty()
    id_user: string; 

}
