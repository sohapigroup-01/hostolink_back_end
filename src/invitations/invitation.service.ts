
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invitation } from './entities/invitation.entity';
import { randomBytes } from 'crypto';
import { User } from 'src/utilisateur/entities/user.entity';
import { InvitationTracking } from './entities/invitation_traking.entity';
import { Compte } from 'src/compte/entitie/compte.entity';


@Injectable()
export class InvitationService {
  constructor(
    @InjectRepository(Invitation)
    private readonly invitationRepository: Repository<Invitation>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    
    @InjectRepository(InvitationTracking)
    private readonly trackingRepository: Repository<InvitationTracking>,

    @InjectRepository(Compte)
    private readonly compteRepository: Repository<Compte>,
    
  ) {}

  async getOrCreateInvitation(id_user: string): Promise<{ code: string; lien: string }> {
    // Vérifie si une invitation existe déjà pour cet utilisateur
    const existing = await this.invitationRepository.findOne({ where: { id_user } });

    if (existing) {
      return {
        code: existing.code_invitation,
        lien: `http://localhost:10000/invite/${existing.code_invitation}`,
      };

    }

    // Génère un nouveau code unique
    const randomCode = 'inv_' + randomBytes(4).toString('hex');

    const nouvelleInvitation = this.invitationRepository.create({
      id_user,
      code_invitation: randomCode,
    });

    await this.invitationRepository.save(nouvelleInvitation);

    return {
      code: nouvelleInvitation.code_invitation,
      lien: `http://localhost:10000/invite/${nouvelleInvitation.code_invitation}`,
    };
  }

  async enregistrerClic(code_invitation: string, ip: string, userAgent: string): Promise<void> {
    const invitation = await this.invitationRepository.findOne({ where: { code_invitation } });
    if (!invitation) {
      throw new NotFoundException("Code d'invitation introuvable");
    }

    const tracking = this.trackingRepository.create({
      code_invitation,
      ip_visiteur: ip,
      user_agent: userAgent,
    });

    await this.trackingRepository.save(tracking);

    invitation.nombre_clicks += 1;
    await this.invitationRepository.save(invitation);
  }
  
  async incrementerNombrePartages(code_invitation: string): Promise<{ message: string }> {
    const invitation = await this.invitationRepository.findOne({ where: { code_invitation } });
    if (!invitation) {
      throw new NotFoundException("Code d'invitation introuvable");
    }
  
    invitation.nombre_partages += 1;
    await this.invitationRepository.save(invitation);
  
    return { message: 'Partage comptabilisé avec succès' };

  }


  
  // async lierInviteAuParrain(id_user_nouveau: string, code_invitation: string): Promise<{ message: string }> {
  //   const invitation = await this.invitationRepository.findOne({ where: { code_invitation } });
  //   if (!invitation) {
  //     throw new NotFoundException("Code d'invitation invalide");
  //   }
  
  //   const nouveau = await this.userRepository.findOne({ where: { id_user: id_user_nouveau } });
  //   if (!nouveau) {
  //     throw new NotFoundException("Nouvel utilisateur introuvable");
  //   }
  
  //   // Sauvegarder le lien
  //   nouveau.code_invitation_utilise = code_invitation;
  //   await this.userRepository.save(nouveau);
  
  //   return { message: "Utilisateur lié au parrain avec succès" };
  // }
  
  

  // async applyBonus({ code_invitation, id_user_nouveau }: ApplyBonusDto): Promise<{ message: string }> {
  //   const invitation = await this.invitationRepository.findOne({ where: { code_invitation } });
  //   if (!invitation) {
  //     throw new NotFoundException("Code d'invitation invalide");
  //   }

  //   const parrain = await this.userRepository.findOne({ where: { id_user: invitation.id_user } });
  //   if (!parrain) {
  //     throw new NotFoundException("Utilisateur parrain introuvable");
  //   }

  //   const compte = await this.compteRepository.findOne({ where: { id_user: parrain.id_user } });
  //   if (!compte) {
  //     throw new NotFoundException("Compte du parrain introuvable");
  //   }

  //   compte.solde_bonus += 500;
  //   await this.compteRepository.save(compte);

  //   invitation.nombre_inscriptions += 1;
  //   await this.invitationRepository.save(invitation);

  //   const nouveauUser = await this.userRepository.findOne({ where: { id_user: id_user_nouveau } });
  //   if (!nouveauUser) {
  //     throw new NotFoundException("Nouvel utilisateur introuvable");
  //   }

  //   nouveauUser.code_invitation_utilise = code_invitation;
  //   await this.userRepository.save(nouveauUser);

  //   return { message: "Bonus appliqué avec succès" };
  // }
}
