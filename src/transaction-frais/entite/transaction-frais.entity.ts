// transaction-frais.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum TransactionFraisType {
  INTERNE = 'interne',
  EXTERNE = 'externe',
  BANCAIRE = 'bancaire'
}

export enum ModePayment {
  WALLET = 'wallet',
  MOBILE_MONEY = 'mobile_money',
  BANQUE = 'banque'
}

@Entity('transactions_frais')
export class TransactionFrais {
  @PrimaryGeneratedColumn()
  id_frais: number;

  @Column()
  id_transaction: number;

  @Column()
  montant_frais: number;

  @Column({
    type: 'varchar',
    length: 20
  })
  type_transaction: TransactionFraisType;

  @Column({
    type: 'varchar',
    length: 20
  })
  mode_paiement: ModePayment;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  date_creation: Date;
}