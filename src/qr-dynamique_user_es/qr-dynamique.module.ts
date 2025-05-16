import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QrDynamiqueController } from './qr-dynamique.controller';
import { QrDynamiqueService } from './qr-dynamique.service_es';
import { QrCodePaiementDynamique } from 'src/qr-dynamique_user_es/entities/qr_code_paiement_dynamique.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QrCodePaiementDynamique])],
  controllers: [QrDynamiqueController],
  providers: [QrDynamiqueService],
})
export class QrDynamiqueModule {}
