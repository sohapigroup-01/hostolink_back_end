import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { UserEtablissementSante } from './user-etablissement-sante.entity';

@Entity('raison_suppression_compte')
export class RaisonSuppressionCompte {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  raison: string;

  @CreateDateColumn()
  date_suppression: Date;

  @ManyToOne(() => UserEtablissementSante, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_user_etablissement_sante' })
  userEtablissementSante: UserEtablissementSante;

}
