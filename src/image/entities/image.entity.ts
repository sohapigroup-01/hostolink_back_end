import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from 'src/utilisateur/entities/user.entity';
import { Administrateur } from 'src/administrateur/entities/administrateur.entity';

export enum ImageMotifEnum {
  PROFILE = 'photo_profile',
  DOCUMENT_IDENTITE_RECTO = 'document_identiter_recto',
  DOCUMENT_IDENTITE_VERSO = 'document_identiter_verso',
  RESEAU_SOCIAL = 'reseau_social',
  DISCUSSION_ASSISTANCE = 'discussion_assistance',
  PUBLICITE = 'publicite',
  ADMINISTRATEUR = 'Administrateur',
  AVATAR_ADMIN = 'avatar_admin',  // ✅ motif ajouté clairement
  AUTRE = 'autre',
}

@Entity('images')
export class Image {
  @PrimaryGeneratedColumn('uuid')
  id_image: string;

  @Column({ type: 'varchar', nullable: false })
  url_image: string;

  @CreateDateColumn()
  date: Date;

  @Column({ type: 'uuid', nullable: true })
  id_user: string | null;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_user' })
  user: User;

  @Column({ type: 'integer', nullable: true })
  id_user_etablissement_sante?: number;


  @Column({ type: 'enum', enum: ImageMotifEnum, nullable: false })
  motif: ImageMotifEnum;

  @Column({ type: 'varchar', length: 50, nullable: true })
  type_user?: string;

  @Column({ type: 'integer', nullable: true })
  id_admin_gestionnaire?: number;

  @ManyToOne(() => Administrateur, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_admin_gestionnaire' })
  administrateur?: Administrateur;
}
