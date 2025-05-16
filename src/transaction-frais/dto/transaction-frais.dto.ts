// dto/create-transaction-frais.dto.ts
import { IsNotEmpty, IsNumber, IsEnum } from 'class-validator';
import { ModePayment, TransactionFraisType } from '../entite/transaction-frais.entity';

export class CreateTransactionFraisDto {
  @IsNotEmpty()
  @IsNumber()
  id_transaction: number;

  @IsNotEmpty()
  @IsNumber()
  montant_frais: number;

  @IsNotEmpty()
  @IsEnum(TransactionFraisType)
  type_transaction: TransactionFraisType;

  @IsNotEmpty()
  @IsEnum(ModePayment)
  mode_paiement: ModePayment;
}