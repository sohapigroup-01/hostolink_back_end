import { User } from 'src/utilisateur/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Check, OneToOne, JoinColumn } from 'typeorm';

// Énumération pour les types d'utilisateurs
export enum TypeUserEnum {
  UTILISATEUR = 'utilisateur',
  ETABLISSEMENT = 'etablissement',
}

@Entity('compte')
@Check(`type_user IN ('${TypeUserEnum.UTILISATEUR}', '${TypeUserEnum.ETABLISSEMENT}')`)
export class Compte {
  @PrimaryGeneratedColumn()
  id_compte: number;

  @Column({ type: 'integer', default: 0 })
  solde_compte: number;

  @Column({ type: 'integer', default: 0 })
  solde_bonus: number;

  @Column({ type: 'integer', default: 0 })
  cumule_mensuel: number;

  @Column({ type: 'integer', default: 0 })
  plafond: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  mode_paiement_preferentiel: string;

  @Column({ type: 'varchar', length: 20 })
  type_user: TypeUserEnum;

  @Column({ type: 'varchar', length: 10, default: 'XOF' })
  devise: string;

  @Column({ type: 'varchar', length: 50, nullable: true, unique: true })
  numero_compte: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_creation_compte: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_modification: Date;

  @Column({ type: 'varchar', length: 20, default: 'actif' })
  statut: string;

  @Column({ type: 'uuid', nullable: true })
  id_user: string;

  @Column({ type: 'integer', nullable: true })
  id_user_etablissement_sante: number;

  @OneToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'id_user' })
  user: User;
}