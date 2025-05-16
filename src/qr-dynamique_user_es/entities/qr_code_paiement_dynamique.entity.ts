import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('qr_code_paiement_dynamique')
export class QrCodePaiementDynamique {
  @PrimaryGeneratedColumn()
  id_qrcode: number;

  @Column({ type: 'text', nullable: true })
  qr_code_valeur: string;

  @CreateDateColumn({ type: 'timestamp' })
  date_creation: Date;

  @Column({ type: 'timestamp' })
  date_expiration: Date;

  @Column({ type: 'varchar', length: 20, default: 'actif' })
  statut: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  token: string;

  @Column({ type: 'int', nullable: true })
  id_user_etablissement_sante: number;

  @Column({ type: 'uuid', nullable: true })
  id_user: string;
}
