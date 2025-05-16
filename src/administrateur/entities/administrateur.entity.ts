import { Annonce } from 'src/annonce/entities/annonce.entity';
import { Conversation } from 'src/Discussion_agent_client/conversations/entities/conversation.entity';
import { QuestionsPredefinies } from 'src/Discussion_agent_client/questions_predefinies/entities/question-predefinie.entity';
import { ListeNumeroEtablissementSante } from 'src/liste_etablissement/entities/liste_numero_vert_etablissement_sante.entity';
import { Thematique } from 'src/thematique_discussion/entities/thematique.entity';

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';

@Entity('administrateurs')
export class Administrateur {
  @PrimaryGeneratedColumn()
  id_admin_gestionnaire: number;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: false })
  telephone: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  mot_de_passe: string;

  @Column({ type: 'varchar', length: 50, nullable: false, default: 'admin' })
  role: string;

  @Column({ type: 'varchar', length: 20, nullable: true, default: 'actif' })
  statut: string;

  @Column({ type: 'jsonb', nullable: true, default: {} })
  permissions: object;

  @Column({ type: 'timestamp', nullable: true })
  dernier_connexion: Date;

  @CreateDateColumn({ type: 'timestamp' })
  date_creation: Date;

  @CreateDateColumn({ type: 'timestamp' })
  date_modification: Date;

  // ✅ Relation avec liste_numero_vert_etablissement_sante
  @OneToMany(() => ListeNumeroEtablissementSante, (liste) => liste.administrateur, { cascade: true })
  liste_numero_vert: ListeNumeroEtablissementSante[];

  @OneToMany(() => Annonce, (annonce) => annonce.id_admin_gestionnaire)
  annonces: Annonce[];

  @OneToMany(() => Thematique, (thematique) => thematique.administrateur)
  thematiques_crees: Thematique[];

  @Column({ type: 'varchar', length: 100, nullable: true })
  nom: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  prenom: string;

  @Column({ type: 'text', nullable: true })
  adresse: string;

  @Column({ type: 'bigint', default: 0 })
  solde_de_rechargement: number;

  @Column({ type: 'bigint', default: 0 })
  cumule_des_transactions: number;






  @OneToMany(() => QuestionsPredefinies, question => question.assistant)
  questions: QuestionsPredefinies[];

  @OneToMany(() => Conversation, conversation => conversation.assistant)
  conversations: Conversation[];
}
