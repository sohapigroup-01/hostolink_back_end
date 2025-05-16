import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEtablissementSante } from './user-etablissement-sante.entity';

@Entity('code_verif_otp')
export class CodeVerifOtp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 6 })
  otp_code: string;

  @Column({ type: 'timestamp' })
  expires_at: Date;

  @Column({ default: true })
  is_valid: boolean;

  @ManyToOne(() => UserEtablissementSante, (user) => user.otps, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_user_etablissement_sante' })
  userEtablissementSante: UserEtablissementSante;

  @Column({ type: 'varchar', nullable: true })
  moyen_envoyer: string;
}
