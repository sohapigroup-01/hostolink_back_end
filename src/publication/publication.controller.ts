
// import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
// import { PublicationService } from './publication.service';
// import { CreatePublicationDto } from './dto/create-publication.dto';
// import { Publication } from './entities/publication.entity';
// import { Commentaire } from 'src/commentaire/entities/commentaire.entity';
// import { CreateCommentaireDto } from 'src/commentaire/dto/create-commentaire.dto';

// @Controller('publication')
// export class PublicationController {
//   constructor(private readonly publicationService: PublicationService) {}

//   @Post()
//   create(@Body() createPublicationDto: CreatePublicationDto): Promise<Publication> {
//     return this.publicationService.create(createPublicationDto);
//   }

//   @Get()
//   findAll(): Promise<Publication[]> {
//     return this.publicationService.findAll();
//   }

//   // récupérer une publication spécifique | QUI NOUS PERMETTRA DE PATARGER UNE PUBLICATION
//   @Get(':id')
//   findOne(@Param('id', ParseIntPipe) id: number): Promise<Publication> {
//     return this.publicationService.findOne(id);
//   }

//   @Get('user/:userId')
//   findByUserId(@Param('userId', ParseIntPipe) userId: number): Promise<Publication[]> {
//     return this.publicationService.findByUserId(userId);
//   }

//   // Ajouter un commentaire à une publication
//   @Post(':id_publication/commentaire')
//   addComment(
//     @Param('id_publication', ParseIntPipe) id_publication: number,
//     @Body() createCommentaireDto: CreateCommentaireDto
//   ): Promise<Commentaire> {
//     // Fusionner l'ID de la publication de l'URL avec le DTO
//     const commentaireData = {
//       ...createCommentaireDto,
//       id_publication
//     };
//     return this.publicationService.addComment(commentaireData);
//   }

//   // Récupérer les commentaires d'une publication
//   @Get(':id_publication/commentaire')
//   getCommentsByPublicationId(
//     @Param('id_publication', ParseIntPipe) id_publication: number
//   ): Promise<Commentaire[]> {
//     return this.publicationService.getCommentsByPublicationId(id_publication);
//   }


// // gestion des like et dislike
//   @Post(':id/like')
//   likePost(@Param('id', ParseIntPipe) id: number): Promise<Publication> {
//     return this.publicationService.likePost(id);
//   }

//   @Post(':id/dislike')
//   dislikePost(@Param('id', ParseIntPipe) id: number): Promise<Publication> {
//     return this.publicationService.dislikePost(id);
//   }
// }