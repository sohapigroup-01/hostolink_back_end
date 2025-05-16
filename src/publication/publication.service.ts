// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { CreatePublicationDto } from './dto/create-publication.dto';
// import { Publication } from './entities/publication.entity';
// import { Commentaire } from 'src/commentaire/entities/commentaire.entity';
// import { CreateCommentaireDto } from 'src/commentaire/dto/create-commentaire.dto';

// @Injectable()
// export class PublicationService {
//   partageService: any;
//   constructor(
//     @InjectRepository(Publication)
//     private readonly publicationRepository: Repository<Publication>,
//     @InjectRepository(Commentaire)
//     private readonly commentaireRepository: Repository<Commentaire>,
//   ) {}

//   // creer une publication
//   async create(createPublicationDto: CreatePublicationDto): Promise<Publication> {
//     const { id_user, ...publicationData } = createPublicationDto;
    
//     const publication = this.publicationRepository.create({
//       ...publicationData,
//       date_publication: new Date(),
//       compteur_like: 0,
//       user: { id_user }
//     });
    
//     return this.publicationRepository.save(publication);
//   }

  
//   //  recupérer une publication spécifique
//   async findOne(id_publication: number): Promise<Publication> {
//     const publication = await this.publicationRepository.findOne({
//       where: { id_publication },
//       relations: ['user', 'commentaires', 'commentaires.user'],
//     });
    
//     if (!publication) {
//       throw new NotFoundException(`Publication avec l'ID ${id_publication} non trouvée`);
//     }
    
//     return publication;
//   }


//   // Méthode pour ajouter un like à une publication
//     async likePost(id_publication: number): Promise<Publication> {
//       const publication = await this.publicationRepository.findOne({ 
//         where: { id_publication } 
//       });

//       if (!publication) {
//         throw new Error('Publication not found');
//       }

//       publication.compteur_like += 1; // Incrémente le compteur de likes
//       return this.publicationRepository.save(publication);
//     }

//     // Méthode pour retirer un like d'une publication
//     async dislikePost(id_publication: number): Promise<Publication> {
//       const publication = await this.publicationRepository.findOne({ 
//         where: { id_publication } 
//       });

//       if (!publication) {
//         throw new Error('Publication not found');
//       }

//       if (publication.compteur_like > 0) {
//         publication.compteur_like -= 1; // Décrémente le compteur de likes
//       }
//       return this.publicationRepository.save(publication);
//     }

//     // récuperer toutes les publications avec les commentaires 
//   async findAll(): Promise<Publication[]> {
//     return this.publicationRepository.find({ 
//       relations: ['user', 'commentaires', 'commentaires.user'],
//       order: { date_publication: 'DESC' }
//     });
//   }

//   // récuperer les publications d'un utilisateur spécifique avec les commentaires 
//   async findByUserId(userId: number): Promise<Publication[]> {
//     return this.publicationRepository.find({
//       where: { user: { id_user: userId } },
//       relations: ['user', 'commentaires', 'commentaires.user'],
//       order: { date_publication: 'DESC' }
//     });
//   }

//   // Ajouter un commentaire à une publication
//   async addComment(createCommentaireDto: CreateCommentaireDto): Promise<Commentaire> {
//     const { id_publication, id_user, contenu } = createCommentaireDto;
    
//     // Vérifier si la publication existe
//     const publication = await this.publicationRepository.findOne({
//       where: { id_publication }
//     });
    
//     if (!publication) {
//       throw new Error('Publication not found');
//     }
    
//     const commentaire = this.commentaireRepository.create({
//       contenu,
//       publication: { id_publication },
//       user: { id_user }
//     });
    
//     return this.commentaireRepository.save(commentaire);
//   }

//   // Récupérer les commentaires d'une publication
//   async getCommentsByPublicationId(id_publication: number): Promise<Commentaire[]> {
//     return this.commentaireRepository.find({
//       where: { publication: { id_publication } },
//       relations: ['user'],
//       order: { date_commentaire: 'DESC' }
//     });
//   }



  
//   // Autres méthodes existantes...
// }