// transaction.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

export enum TransactionStatus {
  EN_ATTENTE = 'en attente',
  REUSSIE = 'réussie',
  ECHOUEE = 'échouée',
  ANNULEE = 'annulée'
}

export enum TransactionType {
  TRANSFERT = 'transfert',
  PAIEMENT = 'paiement',
  REMBOURSEMENT = 'remboursement',
  RECHARGE = 'recharge'
}

@Entity('transaction_interne')
export class Transaction {
  @PrimaryGeneratedColumn()
  id_transaction: number;

  @Column()
  id_compte_expediteur: number;

  @Column({ nullable: true })
  id_utilisateur_envoyeur: string; // UUID

  @Column({ nullable: true })
  id_utilisateur_recepteur: string; // UUID

  @Column({ nullable: true })
  id_etablissement_recepteur: number;

  @Column({ nullable: true })
  id_etablissement_envoyeur: number;

  @Column('numeric', { precision: 15, scale: 2 })
  montant_envoyer: number;

  @Column('numeric', { precision: 15, scale: 2 })
  montant_recu: number;

  @Column('numeric', { precision: 15, scale: 2, nullable: true })
  frais_preleve: number;

  @Column({
    type: 'varchar',
    length: 20,
    default: TransactionStatus.EN_ATTENTE
  })
  statut: TransactionStatus;

  @Column({ type: 'varchar', length: 10, nullable: true })
  devise_transaction: string;



  @Column({ type: 'varchar', length: 50, nullable: true })
  motif_annulation: string;

  

  @Column({ type: 'varchar', length: 100, nullable: true })
  type_transaction: TransactionType;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  date_transaction: Date;

  @Column({ nullable: true })
  id_qrcode_dynamique: number;

  @Column({ nullable: true })
  id_qrcode_statique: number;

  @Column()
  id_compte_recepteur: number;
}