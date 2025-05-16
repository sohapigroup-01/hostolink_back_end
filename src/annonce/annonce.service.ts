import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Annonce } from './entities/annonce.entity';
import { CreateAnnonceDto } from './dto/create-annonce.dto';
import { Administrateur } from 'src/administrateur/entities/administrateur.entity';
import { UpdateAnnonceDto } from './dto/update-annoce.dto';


@Injectable()
export class AnnonceService {
  constructor(
    @InjectRepository(Annonce)
    private annonceRepository: Repository<Annonce>,

    @InjectRepository(Administrateur)
    private adminRepository: Repository<Administrateur>,
  ) {}

  async createAnnonce(dto: CreateAnnonceDto): Promise<Annonce> {
    // Vérifier si l'administrateur existe
    const admin = await this.adminRepository.findOne({ where: { id_admin_gestionnaire: dto.id_admin_gestionnaire } });

    if (!admin) {
      throw new NotFoundException('Administrateur introuvable');
    }

    // Création de l'annonce en associant l'administrateur
    const annonce = this.annonceRepository.create({
      titre_annonce: dto.titre_annonce,
      description_annonce: dto.description_annonce,
      url_images: dto.url_images,
      id_admin_gestionnaire: admin, // Associer l'entité Administrateur et non juste un ID
    });

    return await this.annonceRepository.save(annonce);
    
  }

  async getAllAnnonces(): Promise<Annonce[]> {
    return await this.annonceRepository.find({
      relations: ['id_admin_gestionnaire'], // Charger l'admin associé à chaque annonce
      order: { date: 'DESC' }, // Trier par date décroissante
    });
  }



  async updateAnnonce(id: number, dto: UpdateAnnonceDto): Promise<Annonce> {
    const annonce = await this.annonceRepository.findOne({ where: { id_annonce: id } });

    if (!annonce) {
      throw new NotFoundException('Annonce non trouvée');
    }

    // Mise à jour des valeurs existantes avec les nouvelles valeurs
    Object.assign(annonce, dto);

    return await this.annonceRepository.save(annonce);
  }


  async deleteAnnonce(id: number): Promise<{ message: string }> {
    const annonce = await this.annonceRepository.findOne({ where: { id_annonce: id } });

    if (!annonce) {
      throw new NotFoundException('Annonce non trouvée');
    }

    await this.annonceRepository.remove(annonce);

    return { message: 'Annonce supprimée avec succès' };
  }
}
