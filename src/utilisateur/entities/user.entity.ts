import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Image } from '../../image/entities/image.entity';
import { MessageThematique } from 'src/thematique_discussion/entities/message_thematique.entity';
import { Otp } from './otp.entity';
import { Invitation } from 'src/invitations/entities/invitation.entity';
import { Conversation } from 'src/Discussion_agent_client/conversations/entities/conversation.entity';


@Entity('utilisateur')  
export class User {

  @PrimaryGeneratedColumn('uuid')
  id_user: string;

  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  email?: string;

  @Column({ type: 'varchar', length: 20, nullable: true, unique: true })
  telephone?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  mdp?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nom?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  prenom?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  pays?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_inscription: Date;

  @Column({ type: 'timestamp', nullable: true })
  dernier_otp_envoye?: Date;


  @Column({ type: 'text', nullable: true })
  raison_banni?: string;

  @Column({ type: 'boolean', default: false })
  compte_verifier: boolean;


  @OneToMany(() => Otp, otp => otp.user, { cascade: true, nullable: true })
  otps?: Otp[];

  @Column('geometry', { spatialFeatureType: 'Point', srid: 4326, nullable: true })
  position?: string;

  @OneToMany(() => Image, (image) => image.user, { cascade: true })
  images?: Image[];

  @Column({ type: 'boolean', default: true })
  actif: boolean;

  @OneToMany(() => MessageThematique, (message) => message.expediteur)
  messagesEnvoyes: MessageThematique[];

  @Column({ nullable: true })
  fcm_token: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  code_invitation_utilise: string | null;


  @OneToMany(() => Invitation, invitation => invitation.user)
  invitations: Invitation[];



  @OneToMany(() => Conversation, conversation => conversation.user)
  conversations: Conversation[];

}
