import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EtablissementSante } from './entities/etablissement_sante.entity';
import { EtablissementSanteRepository } from './repository/etablissement_sante.repository';
import { UpdateEtablissementDto } from './dto/update-etablissement.dto';

@Injectable()
export class EtablissementSanteService {
  constructor(
    @InjectRepository(EtablissementSante)
    private readonly etablissementSanteRepository: Repository<EtablissementSante>,
    private readonly etablissementSanteRepo: EtablissementSanteRepository,
  ) {}

  // créer
  async createEtablissement(data: Partial<EtablissementSante>): Promise<EtablissementSante> {
    const result = await this.etablissementSanteRepository
      .createQueryBuilder()
      .insert()
      .into(EtablissementSante)
      .values({
        nom: data.nom,
        telephone: data.telephone,
        categorie: data.categorie,
        adresse: data.adresse,
        latitude: data.latitude,
        longitude: data.longitude,
        geom: () =>
            `ST_SetSRID(ST_MakePoint(${data.longitude}, ${data.latitude}), 4326)`,
      })
      .returning('*')
      .execute();

    const insertedEtablissement = result.raw[0];

    // Mettre à jour `geom` après insertion
    await this.etablissementSanteRepository
      .createQueryBuilder()
      .update(EtablissementSante)
      .set({
        geom: () =>
          `ST_SetSRID(ST_MakePoint(${insertedEtablissement.longitude}, ${insertedEtablissement.latitude}), 4326)`,
      })
      .where('id_user_etablissement_sante = :id', { id: insertedEtablissement.id })
      .execute();

    return insertedEtablissement;
  }

  // tout recp
  async findAll(): Promise<EtablissementSante[]> {
    return this.etablissementSanteRepository.find();
  }

  // recup par id unique
  async findOne(id: number): Promise<EtablissementSante> {
    const etablissement = await this.etablissementSanteRepository.findOne({ where: { id } });
  
    if (!etablissement) {
      throw new NotFoundException(`Établissement avec l'ID ${id} introuvable.`);
    }
  
    return etablissement;
  }

  // calcul dans la distance en fonctione de la postion
  async findNearby(lat: number, lng: number, distance: number): Promise<EtablissementSante[]> {
    return this.etablissementSanteRepo.findNearby(lat, lng, distance); // ✅ Utilisation du repository
  }

  // search par category
  async findNearbyByCategory(
    lat: number,
    lng: number,
    distance: number,
    categorie: string,
  ): Promise<EtablissementSante[]> {
    return this.etablissementSanteRepo.findNearbyByCategory(lat, lng, distance, categorie);
  }

  // search par nom
  async findByName(nom: string): Promise<EtablissementSante[]> {
    return this.etablissementSanteRepo.findByName(nom);
  }

  // mise à jour
  async updateEtablissement(
    id: number,
    updateData: UpdateEtablissementDto,
  ): Promise<EtablissementSante> {
    // Vérifie  existe
    const etablissement = await this.etablissementSanteRepository.findOne({ where: { id } });
  
    if (!etablissement) {
      throw new NotFoundException(`Établissement avec l'ID ${id} introuvable.`);
    }
  
    // Met à jour les champs de l'établissement
    Object.assign(etablissement, updateData);
  
    // Si latitude ou longitude sont modifiés, mettre à jour le champ geom aussi
    if (updateData.latitude !== undefined && updateData.longitude !== undefined) {
      etablissement.geom = {
        type: 'Point',
        coordinates: [updateData.longitude, updateData.latitude],
      };
    }
  
    return this.etablissementSanteRepository.save(etablissement);
  }

  // suppression
  async deleteEtablissement(id: number): Promise<void> {
    const result = await this.etablissementSanteRepository.delete(id);
  
    if (result.affected === 0) {
      throw new NotFoundException(`Établissement avec l'ID ${id} introuvable.`);
    }
  }

}
