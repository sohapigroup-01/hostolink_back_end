// dto/create-transaction.dto.ts
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, IsEnum } from 'class-validator';
import { TransactionStatus, TransactionType } from '../entitie/transaction-interne.entity';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsNumber()
  id_compte_expediteur: number;

  @IsOptional()
  @IsUUID()
  id_utilisateur_envoyeur?: string;

  @IsOptional()
  @IsUUID()
  id_utilisateur_recepteur?: string;

  @IsOptional()
  @IsNumber()
  id_etablissement_recepteur?: number;

  @IsOptional()
  @IsNumber()
  id_etablissement_envoyeur?: number;

  @IsNotEmpty()
  @IsNumber()
  montant_envoyer: number;

  @IsNotEmpty()
  @IsNumber()
  montant_recu: number;

  @IsOptional()
  @IsNumber()
  frais_preleve?: number;



  @IsOptional()
  @IsString()
  motif_annulation?: string;

  
  
  @IsOptional()
  @IsEnum(TransactionStatus)
  statut?: TransactionStatus;

  @IsOptional()
  @IsString()
  devise_transaction?: string;

  @IsOptional()
  @IsEnum(TransactionType)
  type_transaction?: TransactionType;

  @IsOptional()
  @IsNumber()
  id_qrcode_dynamique?: number;

  @IsOptional()
  @IsNumber()
  id_qrcode_statique?: number;

  @IsNotEmpty()
  @IsNumber()
  id_compte_recepteur: number;
}