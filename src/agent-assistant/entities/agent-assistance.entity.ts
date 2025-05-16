// src/entities/agent-assistance.entity.ts
import { Conversation } from 'src/Discussion_agent_client/conversations/entities/conversation.entity';
import { QuestionsPredefinies } from 'src/Discussion_agent_client/questions_predefinies/entities/question-predefinie.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';


@Entity('agent_assistance')
export class AgentAssistance {
  @PrimaryGeneratedColumn({ name: 'id_agent_assistance' })
  id: number;

  @Column({ name: 'id_admin_gestionnaire' })
  idAdminGestionnaire: number;

  @Column({ name: 'nom', length: 100 })
  nom: string;

  @Column({ name: 'prenom', length: 100 })
  prenom: string;

  @Column({ name: 'email', length: 255, unique: true })
  email: string;

  @Column({ name: 'telephone', length: 20, nullable: true })
  telephone: string;

  @Column({ name: 'mdp', length: 255 })
  mdp: string;

  @Column({ name: 'statut', length: 20, default: 'actif' })
  statut: string;

  @Column({ name: 'date_creation', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateCreation: Date;

  @Column({ name: 'date_modification', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateModification: Date;

  @Column({ name: 'url_photo_agent', length: 255, nullable: true })
  urlPhotoAgent: string;

  @OneToMany(() => QuestionsPredefinies, question => question.assistant)
  questions: QuestionsPredefinies[];

  @OneToMany(() => Conversation, conversation => conversation.assistant)
  conversations: Conversation[];
}