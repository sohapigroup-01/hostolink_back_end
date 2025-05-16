import { Module } from '@nestjs/common';
import { TransactionFraisController } from './transaction-frais.controller';
import { TransactionFraisService } from './transaction-frais.service';
import { TransactionFrais } from './transaction-frais.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionFrais]),
    // autres imports
  ],
  controllers: [TransactionFraisController],
  providers: [TransactionFraisService],
  exports: [TransactionFraisService]
})
export class TransactionFraisModule {}
