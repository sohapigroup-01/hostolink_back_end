
// // import { Injectable } from '@nestjs/common';
// // import { InjectRepository } from '@nestjs/typeorm';
// // import { Repository } from 'typeorm';
// // import { Commentaire } from './entities/commentaire.entity';
// // import { CreateCommentaireDto } from './dto/create-commentaire.dto';

// // @Injectable()
// // export class CommentaireService {
// //   createCommentaire(id_publication: number, createCommentaireDto: CreateCommentaireDto) {
// //     throw new Error('Method not implemented.');
// //   }
// //   constructor(
// //     @InjectRepository(Commentaire)
// //     private readonly commentaireRepository: Repository<Commentaire>,
// //   ) {}

// //   async create(id_publication: number, createCommentaireDto: CreateCommentaireDto): Promise<Commentaire> {
// //     const { id_publication, id_user, ...commentaireData } = createCommentaireDto;
    
// //     const commentaire = this.commentaireRepository.create({
// //       ...commentaireData,
// //       publication: { id_publication },
// //       user: { id_user }
// //     });
    
// //     return this.commentaireRepository.save(commentaire);
// //   }

// //   // Modifiée pour n'accepter qu'un seul paramètre
// //   async findByPublicationId(id_publication: number): Promise<Commentaire[]> {
// //     return this.commentaireRepository.find({
// //       where: { publication: { id_publication } },
// //       relations: ['user'],
// //       order: { date_commentaire: 'DESC' }
// //     });
// //   }

// //   // Nouvelle méthode pour filtrer par publication ET utilisateur
// //   async findByPublicationIdAndUserId(id_publication: number, id_user: number): Promise<Commentaire[]> {
// //     return this.commentaireRepository.find({
// //       where: {
// //         publication: { id_publication },
// //         user: { id_user }
// //       },
// //       relations: ['user'],
// //       order: { date_commentaire: 'DESC' }
// //     });
// //   }
// // }


// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Commentaire } from './entities/commentaire.entity';
// import { CreateCommentaireDto } from './dto/create-commentaire.dto';
// import { Publication } from 'src/publication/entities/publication.entity';
// import { User } from 'src/utilisateur/entities/user.entity';

// @Injectable()
// export class CommentaireService {
//   constructor(
//     @InjectRepository(Commentaire)
//     private readonly commentaireRepository: Repository<Commentaire>,
//     @InjectRepository(Publication)
//     private readonly publicationRepository: Repository<Publication>,
//     @InjectRepository(User)
//     private readonly userRepository: Repository<User>,
//   ) {}

//   async create(id_publication: number, createCommentaireDto: CreateCommentaireDto): Promise<Commentaire> {
//     const { id_user, contenu } = createCommentaireDto;

//     // Vérifier si la publication existe
//     const publication = await this.publicationRepository.findOne({
//       where: { id_publication },
//     });

//     if (!publication) {
//       throw new NotFoundException(`Publication avec id ${id_publication} non trouvée`);
//     }

//     // Vérifier si l'utilisateur existe
//     const user = await this.userRepository.findOne({
//       where: { id_user },
//     });

//     if (!user) {
//       throw new NotFoundException(`Utilisateur avec id ${id_user} non trouvé`);
//     }

//     // Créer et sauvegarder le commentaire
//     const commentaire = this.commentaireRepository.create({
//       contenu,
//       publication,
//       user,
//     });

//     return this.commentaireRepository.save(commentaire);
//   }

//   // ✅ Récupérer tous les commentaires d'une publication spécifique
//   async findByPublicationId(id_publication: number): Promise<Commentaire[]> {
//     return this.commentaireRepository.find({
//       where: { publication: { id_publication } },
//       relations: ['user'],
//       order: { date_commentaire: 'DESC' },
//     });
//   }

//   // ✅ Récupérer tous les commentaires d'une publication spécifique par un utilisateur donné
//   async findByPublicationIdAndUserId(id_publication: number, id_user: number): Promise<Commentaire[]> {
//     return this.commentaireRepository.find({
//       where: {
//         publication: { id_publication },
//         user: { id_user },
//       },
//       relations: ['user'],
//       order: { date_commentaire: 'DESC' },
//     });
//   }
// }
