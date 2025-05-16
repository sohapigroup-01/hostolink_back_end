// // src/partage/partage.controller.ts
// import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
// import { PartageService } from './partage.service';
// import { Partage } from './entities/partage.entity';
// import { CreatePartageDto } from './dto/partage.dto';
// import { count } from 'rxjs/operators';

// @Controller('partage')
// export class PartageController {
//   constructor(private readonly partageService: PartageService) {}

//   @Post()
//   create(@Body() createPartageDto: CreatePartageDto): Promise<Partage> {
//     return this.partageService.create(createPartageDto);
//   }

//   @Get('publication/:id_publication')
//   findByPublication(
//     @Param('id_publication', ParseIntPipe) id_publication: number,
//   ): Promise<Partage[]> {
//     return this.partageService.findByPublication(id_publication);
//   }

//   @Get('user/:id_user')
//   findByUser(
//     @Param('id_user', ParseIntPipe) id_user: number,
//   ): Promise<Partage[]> {
//     return this.partageService.findByUser(id_user);
//   }

//   @Get('shared/:uniqueId')
//   async getSharedPublication(@Param('uniqueId') uniqueId: string) {
//     const partage = await this.partageService.findByUniqueId(uniqueId);
//     await this.partageService.incrementClics(partage.id_partage);


// //     // src/partage/partage.controller.ts
// // // Ajoutez ces endpoints à votre contrôleur existant

// //     @Get('count/publication/:id_publication')
// //     async countByPublication(
// //     @Param('id_publication', ParseIntPipe) id_publication: number,
// //     ): Promise<{ count: number }> {
// //     const count = await this.partageService.countByPublication(id_publication);
// //     return { count };
// //     }

// //     // @Get('stats/publication/:id_publication')
// //     // getPublicationShareStats(
// //     // @Param('id_publication', ParseIntPipe) id_publication: number,
// //     // ): Promise<any> {
// //     // return this.partageService.getPublicationShareStats(id_publication);
// //     // }
    
//     // Rediriger vers la page de la publication ou renvoyer les détails
//     return {
//       partage,
//       publication: partage.publication,
//     };
//   }
// }

// function countByPublication(arg0: any, id_publication: any, number: any) {
//     throw new Error('Function not implemented.');
// }
