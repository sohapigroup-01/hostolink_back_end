// dto/rollback-transaction.dto.ts
import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class RollbackTransactionDto {
  // @IsNotEmpty()
  // @IsNumber()
  // id_transaction: number;
  
  @IsOptional()
  @IsString()
  motif?: string;
}