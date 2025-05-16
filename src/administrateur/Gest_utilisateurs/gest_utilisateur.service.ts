import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../utilisateur/entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';  // ✅ Celui d'admin
import { ActivationUserDto } from './dto/activation-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';


@Injectable()
export class GestUtilisateurService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource
    
  ) {}

    // ✅ Vérifie si un utilisateur existe (email ou téléphone)
    async checkUserExistence(identifier: string): Promise<boolean> {
      const user = await this.userRepository.findOne({
        where: [{ email: identifier }, { telephone: identifier }],
      });
      return !!user;
    }

  // async findAll(): Promise<{ total: number; utilisateurs: User[] }> {
  //   const users = await this.userRepository.find({
  //     relations: ['images'],
  //   });
  
  //   // Filtrer pour ne garder que l'URL de la photo de profil
  //   const utilisateurs = users.map(user => ({
  //     ...user,
  //     image_profil: user.images?.find(img => img.motif === 'photo_profile')?.url_image || null,
  //     images: undefined, // Supprimer le champ "images"
  //   }));
  
  //   return {
  //     total: users.length,  // Nombre total d'utilisateurs
  //     utilisateurs,
  //   };
  // }

  async findAll(): Promise<{ total: number; utilisateurs: any[] }> {
    const users = await this.userRepository.find({
      relations: ['images'],
    });
  
    const utilisateurs = await Promise.all(
      users.map(async (user) => {
        const [compte] = await this.dataSource.query(
          `SELECT * FROM compte WHERE id_user = $1 LIMIT 1`,
          [user.id_user],
        );
  
        const [qrStatique] = await this.dataSource.query(
          `SELECT * FROM qr_code_paiement_statique WHERE id_user = $1 LIMIT 1`,
          [user.id_user],
        );
  
        const [qrDynamique] = await this.dataSource.query(
          `SELECT * FROM qr_code_paiement_dynamique 
           WHERE id_user = $1 AND statut = 'actif' AND date_expiration > NOW() 
           ORDER BY date_creation DESC LIMIT 1`,
          [user.id_user],
        );
  
        return {
          ...user,
          image_profil: user.images?.find(img => img.motif === 'photo_profile')?.url_image || null,
          images: undefined,
          compte: compte || null,
          qr_code_statique: qrStatique || null,
          qr_code_dynamique: qrDynamique || null,
        };
      }),
    );
  
    return {
      total: utilisateurs.length,
      utilisateurs,
    };
  }
  

  async findOne(id_user: string): Promise<Omit<User, 'images'> & { image_profil: string | null }> {
    const user = await this.userRepository.findOne({
      where: { id_user },
      relations: ['images'],
    });
  
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé.');
    }
  
    // Extraire uniquement l'URL de la photo de profil
    const image_profil = user.images?.find(img => img.motif === 'photo_profile')?.url_image || null;
  
    // Supprimer la propriété "images" avant de retourner l'utilisateur
    const { images, ...userSansImages } = user;
  
    return {
      ...userSansImages, // ✅ Toutes les propriétés sauf "images"
      image_profil,      // ✅ Ajout de l'URL de la photo de profil
    };
  }

  async updateBanReason(id_user: string, updateUserDto: UpdateUserDto): Promise<User & { image_profil: string | null }> {
    const { raison_banni } = updateUserDto;
  
    if (!raison_banni) {
      throw new BadRequestException('La raison du bannissement est requise.');
    }
  
    await this.userRepository.update(id_user, { raison_banni } as Partial<User>);
  
    return this.findOne(id_user);
  }
  
  

  async remove(id_user: string): Promise<void> {
    await this.userRepository.delete(id_user);
  }

  async updateActivation(id_user: string, activationUserDto: ActivationUserDto): Promise<User> {
    const { actif } = activationUserDto;
  
    // Vérifier si l'utilisateur existe
    const user = await this.userRepository.findOne({ where: { id_user } });
  
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé.');
    }
  
    // Mettre à jour l'état actif/inactif
    user.actif = actif;
    await this.userRepository.save(user);
  
    return user;
  }

  async resetPassword(id_user: string, resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    const { nouveau_mot_de_passe } = resetPasswordDto;
  
    // Vérifier si l'utilisateur existe
    const user = await this.userRepository.findOne({ where: { id_user } });
  
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé.');
    }
  
    // Hacher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(nouveau_mot_de_passe, 10);
  
    // Mettre à jour le mot de passe
    user.mdp = hashedPassword;
    await this.userRepository.save(user);
  
    return { message: 'Mot de passe réinitialisé avec succès.' };
  }
}
