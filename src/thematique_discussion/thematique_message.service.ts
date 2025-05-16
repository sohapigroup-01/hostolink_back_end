import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

import { User } from 'src/utilisateur/entities/user.entity';
import { Administrateur } from 'src/administrateur/entities/administrateur.entity';
import { MessageThematique } from './entities/message_thematique.entity';
import { Thematique } from './entities/thematique.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { CreateThematiqueDto } from './dto/create-thematique.dto';
import { RepondreMessageExpertDto } from './dto/reponse-message-expert.dto';
import { ExpertSante } from 'src/user_etablissement_sante/entities/expert_sante.entity';



@Injectable()
export class ThematiqueDiscussionService {
  constructor(
    @InjectRepository(MessageThematique)
    private readonly messageRepo: Repository<MessageThematique>,

    @InjectRepository(Thematique)
    private readonly thematiqueRepo: Repository<Thematique>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Administrateur)
    private readonly adminRepo: Repository<Administrateur>,

    @InjectRepository(ExpertSante)
    private readonly expertRepo: Repository<ExpertSante>,

    // ✅ Injection du service Firebase
  ) {}

  // ✅ Créer un message dans une thématique
  async createMessage(dto: CreateMessageDto): Promise<MessageThematique> {
    const thematique = await this.thematiqueRepo.findOneBy({
      id_thematique_discussion: dto.id_thematique_discussion,
    });
    if (!thematique) {
      throw new NotFoundException('Thématique non trouvée');
    }

    const expediteur = await this.userRepo.findOneBy({ id_user: dto.id_expediteur });
    if (!expediteur) {
      throw new NotFoundException('Expéditeur introuvable');
    }

    const message = this.messageRepo.create({
      thematique,
      expediteur,
      contenu: dto.contenu,
      type_message: dto.type_message,
      url_image: dto.url_image || undefined,
      status_reponse: false, 
    });

    const savedMessage = await this.messageRepo.save(message);

    // // 🔔 Envoi de la notification Firebase
    // if (expediteur.fcm_token) {
    //   await this.firebaseService.sendNotification(
    //     expediteur.fcm_token,
    //     'Nouveau message',
    //     dto.contenu,
    //   );
    // }

    return savedMessage;
  }

  // ✅ Créer une thématique de discussion
  async createThematique(dto: CreateThematiqueDto): Promise<Thematique> {
    const admin = await this.adminRepo.findOneBy({
      id_admin_gestionnaire: dto.id_admin_gestionnaire,
    });

    if (!admin) {
      throw new NotFoundException('Administrateur introuvable');
    }

    const nouvelleThematique = this.thematiqueRepo.create({
      administrateur: admin,
      titre_thematique: dto.titre_thematique,
      sous_titre: dto.sous_titre,
      image: dto.image,
      description: dto.description,
      nbre_expert: dto.nbre_expert || 0,
    });

    return this.thematiqueRepo.save(nouvelleThematique);
  }

  async getMessagesByThematique(id_thematique_discussion: number): Promise<any[]> {
    const messages = await this.messageRepo.find({
      where: {
        thematique: { id_thematique_discussion },
      },
      relations: ['expediteur', 'expert'],
      order: {
        date_envoi: 'ASC',
      },
    });
  
    return messages;
  }
  

  async marquerMessagesCommeLus(id_thematique: number, id_user: string): Promise<void> {
    await this.messageRepo.update(
      {
        thematique: { id_thematique_discussion: id_thematique },
        expediteur: { id_user: Not(id_user) },
        est_lu: false,
      },
      { est_lu: true }
    );
  }
  
  async repondreEnTantQueExpert(dto: RepondreMessageExpertDto): Promise<MessageThematique> {
    const thematique = await this.thematiqueRepo.findOneBy({
      id_thematique_discussion: dto.id_thematique_discussion,
    });
    if (!thematique) throw new NotFoundException('Thématique non trouvée');
  
    const expert = await this.expertRepo.findOneBy({ id_expert: dto.id_expert });
    if (!expert) throw new NotFoundException('Expert introuvable');
  
    const message = this.messageRepo.create({
      thematique,
      expert,
      contenu: dto.contenu,
      type_message: dto.type_message,
      url_image: dto.url_image || undefined,
      status_reponse: true,
    });
  
    return await this.messageRepo.save(message);
  }
  
}
