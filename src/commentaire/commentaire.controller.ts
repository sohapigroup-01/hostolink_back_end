

// import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
// import { CommentaireService } from './commentaire.service';
// import { CreateCommentaireDto } from './dto/create-commentaire.dto';
// import { Commentaire } from './entities/commentaire.entity';

// @Controller('publication')
// export class CommentaireController {
//   constructor(private readonly commentaireService: CommentaireService) {}

//   // ✅ Insérer un commentaire sous une publication spécifique
//   @Post(':id_publication/commentaire')
//   create(
//     @Param('id_publication', ParseIntPipe) id_publication: number,
//     @Body() createCommentaireDto: CreateCommentaireDto
//   ): Promise<Commentaire> {
//     return this.commentaireService.create(id_publication, createCommentaireDto);
//   }

//   // ✅ Récupérer les commentaires d'un utilisateur sur une publication
//   @Get(':id_publication/commentaire/user/:id_user')
//   findByPublicationIdAndUserId(
//     @Param('id_publication', ParseIntPipe) id_publication: number,
//     @Param('id_user', ParseIntPipe) id_user: number
//   ): Promise<Commentaire[]> {
//     return this.commentaireService.findByPublicationIdAndUserId(id_publication, id_user);
//   }

//   // ✅ Récupérer tous les commentaires d'une publication
//   @Get(':id_publication/commentaire')
//   findByPublicationId(
//     @Param('id_publication', ParseIntPipe) id_publication: number
//   ): Promise<Commentaire[]> {
//     return this.commentaireService.findByPublicationId(id_publication);
//   }
// }
