import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../utilisateur/entities/user.entity';

export enum MoyenEnvoiEnum {
  SMS = 'SMS',
  EMAIL = 'email',
  TELEPHONE = "TELEPHONE",
}

@Entity('code_verif_otp')
export class Otp {
  @PrimaryGeneratedColumn()
  id: number;

 @ManyToOne(() => User, user => user.otps, { onDelete: 'CASCADE', nullable: true, eager: true })
  @JoinColumn({ name: 'id_user' })  
  user?: User;  

  @Column({ type: 'uuid', nullable: true, default: null })
  id_user_etablissement_sante: string | null;




  @Column({ type: 'varchar', length: 4, nullable: false })
  otp_code: string;

  @Column({ type: 'enum', enum: MoyenEnvoiEnum, nullable: false })
  moyen_envoyer: MoyenEnvoiEnum; 

  // @Column({nullable: false })
  // moyen_envoyer: string;


  @Column({ type: 'timestamp' })
  expires_at: Date;

  @Column({ type: 'boolean', default: true })
  is_valid: boolean;
  
}
