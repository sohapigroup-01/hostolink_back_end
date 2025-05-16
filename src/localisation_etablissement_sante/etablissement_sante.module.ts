import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EtablissementSante } from './entities/etablissement_sante.entity';
import { EtablissementSanteService } from './etablissement_sante.service';
import { EtablissementSanteController } from './etablissement_sante.controller';
import { EtablissementSanteRepository } from './repository/etablissement_sante.repository';

@Module({
  imports: [TypeOrmModule.forFeature([EtablissementSante])], 
  providers: [
    EtablissementSanteService,
    EtablissementSanteRepository, 
  ],
  controllers: [EtablissementSanteController],
  exports: [
    EtablissementSanteService, 
    EtablissementSanteRepository, 
    TypeOrmModule, 
  ],
})
export class EtablissementSanteModule {}
