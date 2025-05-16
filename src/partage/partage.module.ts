// // src/partage/partage.module.ts
// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { PartageController } from './partage.controller';
// import { PartageService } from './partage.service';
// import { Partage } from './entities/partage.entity';

// @Module({
//   imports: [TypeOrmModule.forFeature([Partage])],
//   controllers: [PartageController],
//   providers: [PartageService],
//   exports: [PartageService],
// })
// export class PartageModule {}