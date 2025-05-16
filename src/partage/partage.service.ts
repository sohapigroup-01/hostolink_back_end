// // src/partage/partage.service.ts
// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Partage } from './entities/partage.entity';
// import { v4 as uuidv4 } from 'uuid'; // Vous devrez installer uuid: npm install uuid
// import { CreatePartageDto } from './dto/partage.dto';

// @Injectable()
// export class PartageService {
//   constructor(
//     @InjectRepository(Partage)
//     private readonly partageRepository: Repository<Partage>,
//   ) {}

//   async create(createPartageDto: CreatePartageDto): Promise<Partage> {
//     // Générer un identifiant unique pour le lien de partage
//     const uniqueId = uuidv4();
//     const lienPartage = `${process.env.APP_URL}/shared/${uniqueId}`;

//     const partage = this.partageRepository.create({
//       user: { id_user: createPartageDto.id_user },
//       publication: { id_publication: createPartageDto.id_publication },
//       lien_partage: lienPartage,
//       plateforme_partage: createPartageDto.plateforme_partage,
//     });

//     return this.partageRepository.save(partage);
//   }

//   async incrementClics(id_partage: number): Promise<Partage> {
//     const partage = await this.partageRepository.findOne({
//       where: { id_partage },
//     });

//     if (!partage) {
//       throw new Error('Partage not found');
//     }

//     partage.nombre_clics += 1;
//     return this.partageRepository.save(partage);
//   }

//   async findByUniqueId(uniqueId: string): Promise<Partage> {
//     const lienPartage = `${process.env.APP_URL}/shared/${uniqueId}`;
//     const partage = await this.partageRepository.findOne({
//       where: { lien_partage: lienPartage },
//       relations: ['publication', 'user'],
//     });

//     if (!partage) {
//       throw new Error('Partage not found');
//     }

//     return partage;
//   }

//   async findByPublication(id_publication: number): Promise<Partage[]> {
//     return this.partageRepository.find({
//       where: { publication: { id_publication } },
//       relations: ['user'],
//     });
//   }

//   async findByUser(id_user: number): Promise<Partage[]> {
//     return this.partageRepository.find({
//       where: { user: { id_user } },
//       relations: ['publication'],
//     });
//   }



//   // gestion des partage

//     async countByPublication(id_publication: number): Promise<number> {
//         // Compte le nombre total de partages pour une publication
//         const count = await this.partageRepository.count({
//         where: { publication: { id_publication } }
//         });
        
//         return count;
//      }
  
//   // Vous pouvez aussi créer une méthode qui retourne des statistiques plus détaillées
//      async getPublicationShareStats(id_publication: number): Promise<any> {
//         // Compte le nombre total de partages
//         const totalShares = await this.partageRepository.count({
//         where: { publication: { id_publication } }
//         });
    
//     }

// }