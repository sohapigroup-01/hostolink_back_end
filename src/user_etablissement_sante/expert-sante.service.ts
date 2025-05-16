import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateExpertSanteDto } from './dto/create-expert.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt'; // 👈 nécessaire pour générer un token
import { ExpertSante } from './entities/expert_sante.entity';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream'; 
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

@Injectable()
export class ExpertSanteService {
  constructor(

    
    @InjectRepository(ExpertSante)
    private readonly expertSanteRepository: Repository<ExpertSante>,

    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource) {}

  private genererIdentifiantAleatoire(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  async creerExpert(dto: CreateExpertSanteDto, idEtab: number) {
    const hash = await bcrypt.hash(dto.mot_de_passe, 10);

    let identifiant: string;
    let existe: any;

    // Vérifie l’unicité de l’identifiant généré
    do {
      identifiant = this.genererIdentifiantAleatoire();
      [existe] = await this.dataSource.query(
        `SELECT * FROM expert_sante WHERE identifiant = $1`,
        [identifiant],
      );
    } while (existe);

    await this.dataSource.query(
      `INSERT INTO expert_sante 
      (id_user_etablissement_sante, nom, prenom, domaine_expertise, identifiant, mot_de_passe, url_profile)
      VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        idEtab,
        dto.nom,
        dto.prenom,
        dto.domaine_expertise,
        identifiant,
        hash,
        'https://res.cloudinary.com/dhrrk7vsd/image/upload/v1740670384/hostolink/xnverykielvbi1w2atjb.jpg',
      ],
    );

    return {
      message: '✅ Expert santé créé avec succès',
      identifiant,
    };
  }

  async loginExpert(identifiant: string, motDePasse: string) {
    const expert = await this.expertSanteRepository.findOne({ where: { identifiant } });
  
    if (!expert) {
      throw new NotFoundException("Identifiant incorrect");
    }
  
    const motDePasseValide = await bcrypt.compare(motDePasse, expert.mot_de_passe);
    if (!motDePasseValide) {
      throw new UnauthorizedException("Mot de passe incorrect");
    }
  
    const payload = { sub: expert.id_expert };
    const token = await this.jwtService.signAsync(payload);
  
    return {
      message: 'Connexion réussie',
      token,
      expert: {
        id: expert.id_expert,
        nom: expert.nom,
        prenom: expert.prenom,
        domaine_expertise: expert.domaine_expertise,
        identifiant: expert.identifiant,
        url_profile: expert.url_profile,
      }
    };
  }

  async updatePasswordExpert(identifiant: string, ancien: string, nouveau: string) {
    const expert = await this.expertSanteRepository.findOne({ where: { identifiant } });
  
    if (!expert) {
      throw new NotFoundException('Expert non trouvé');
    }
  
    const valide = await bcrypt.compare(ancien, expert.mot_de_passe);
    if (!valide) {
      throw new UnauthorizedException('Ancien mot de passe incorrect');
    }
  
    const hash = await bcrypt.hash(nouveau, 10);
    expert.mot_de_passe = hash;
    await this.expertSanteRepository.save(expert);
  
    return { message: 'Mot de passe mis à jour avec succès' };
  }


  async getExpertById(id: number) {
    const expert = await this.expertSanteRepository.findOne({ where: { id_expert: id } });
    if (!expert) throw new NotFoundException('Expert non trouvé');
  
    return {
      id: expert.id_expert,
      nom: expert.nom,
      prenom: expert.prenom,
      domaine_expertise: expert.domaine_expertise,
      identifiant: expert.identifiant,
      url_profile: expert.url_profile,
    };
  }

  async getExpertsByEtablissement(idEtab: number) {
    const experts = await this.expertSanteRepository.find({
      where: {
        user_etablissement_sante: {
          id_user_etablissement_sante: idEtab,
        },
      },
      order: { id_expert: 'ASC' },
    });
  
    return {
      total: experts.length,
      experts: experts.map((e) => ({
        id: e.id_expert,
        nom: e.nom,
        prenom: e.prenom,
        domaine_expertise: e.domaine_expertise,
        identifiant: e.identifiant,
        url_profile: e.url_profile,
      })),
    };
  }
  
  async deleteExpertByEtablissement(idExpert: number, idEtab: number) {
    const expert = await this.expertSanteRepository.findOne({
      where: {
        id_expert: idExpert,
        user_etablissement_sante: {
          id_user_etablissement_sante: idEtab,
        },
      },
    });
  
    if (!expert) {
      throw new NotFoundException("Cet expert n'existe pas ou ne vous appartient pas.");
    }
  
    await this.expertSanteRepository.remove(expert);
  
    return { message: 'Expert supprimé avec succès.' };
  }


  async updateAvatar(file: Express.Multer.File, idExpert: number) {
    const expert = await this.expertSanteRepository.findOne({
      where: { id_expert: idExpert },
      relations: ['user_etablissement_sante'],
    });
  
    if (!expert) {
      throw new NotFoundException("Expert non trouvé");
    }
  
    const etabId = expert.user_etablissement_sante.id_user_etablissement_sante;
    const folder = `dossier_hostolink_preset/${etabId}_user_etablissement_sante/${idExpert}_expert`;
  
    // 🔁 Supprimer l'image précédente si déjà enregistrée
    if (expert.url_profile && expert.url_profile.includes('cloudinary.com')) {
      const publicId = this.extractPublicIdFromUrl(expert.url_profile);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId).catch(() => null);
      }
    }
  
    // ⬆️ Stream upload
    const uploadFromBuffer = (fileBuffer: Buffer): Promise<string> => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder,
            public_id: 'profile',
            overwrite: true,
          },
          (error, result) => {
            if (error || !result) return reject(error);
            resolve(result.secure_url);
          }
        );
  
        Readable.from(fileBuffer).pipe(uploadStream);
      });
    };
  
    const url = await uploadFromBuffer(file.buffer);
    expert.url_profile = url;
    await this.expertSanteRepository.save(expert);
  
    return { message: 'Photo de profil mise à jour avec succès', url };
  }
  private extractPublicIdFromUrl(url: string): string | null {
    const match = url.match(/upload\/(?:v\d+\/)?(.+)\.(jpg|jpeg|png|gif)/);
    return match ? match[1] : null;
  }
  
  
  
}
