import { Repository, DataSource } from 'typeorm'; 
import { Injectable } from '@nestjs/common';
import { EtablissementSante } from '../entities/etablissement_sante.entity';

@Injectable()
export class EtablissementSanteRepository extends Repository<EtablissementSante> {
  constructor(private dataSource: DataSource) {
    super(EtablissementSante, dataSource.createEntityManager());
  }

  async findNearby(lat: number, lng: number, distance: number): Promise<EtablissementSante[]> {
    return this.dataSource.getRepository(EtablissementSante)
      .createQueryBuilder('etablissement')
      .where(`ST_DWithin(geom::geography, ST_MakePoint(:lng, :lat)::geography, :distance)`)
      .setParameters({ lat, lng, distance })
      .getMany();
  }

  async findNearbyByCategory(lat: number, lng: number, distance: number, categorie: string): Promise<EtablissementSante[]> {
    return this.dataSource.getRepository(EtablissementSante)
      .createQueryBuilder('etablissement')
      .where(`ST_DWithin(geom::geography, ST_MakePoint(:lng, :lat)::geography, :distance)
              AND categorie ILIKE :categorie`)
      .setParameters({ lat, lng, distance, categorie: `%${categorie}%` })
      .getMany();
  }

  async findByName(nom: string): Promise<EtablissementSante[]> {
    return this.dataSource.getRepository(EtablissementSante)
      .createQueryBuilder('etablissement')
      .where(`etablissement.nom ILIKE :nom`, { nom: `%${nom}%` })
      .getMany();
  }
}
