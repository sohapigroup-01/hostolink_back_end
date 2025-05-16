
// import { Module, forwardRef } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { QrCodeService } from './qr-code.service';
// import { QrCodeController } from './qr-code.controller';
// import { QrCodeDynamique } from './entitie/qr_code_dynamique.entity';
// import { QrCodeStatique } from './entitie/qr_code_statique.entity';
// import { JwtModule } from '@nestjs/jwt';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { CleanupService } from './cleanup.service';
// import { ScheduleModule } from '@nestjs/schedule';
// import { UserModule } from 'src/utilisateur/user.module';
// import { CompteModule } from 'src/compte/compte.module';

// @Module({
//   imports: [
//     TypeOrmModule.forFeature([QrCodeDynamique, QrCodeStatique]),
//     JwtModule.registerAsync({
//       imports: [ConfigModule],
//       inject: [ConfigService],
//       useFactory: async (configService: ConfigService) => ({
//         secret: configService.get<string>('JWT_QR_SECRET', 'qr_code_secret_key'),
//         signOptions: { expiresIn: '1h' }, // Valeur par défaut
//       }),
//     }),
//     forwardRef(() => UserModule),
//     ScheduleModule.forRoot(),
//     forwardRef(() => CompteModule), // Nécessaire pour les tâches programmées
//     // Décommentez quand le module d'établissement de santé sera disponible
//     // forwardRef(() => EtablissementSanteModule),
//   ],
//   controllers: [QrCodeController],
//   providers: [QrCodeService, CleanupService],
//   exports: [QrCodeService]
// })
// export class QrCodeModule {}



import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QrCodeService } from './qr-code.service';
import { QrCodeController } from './qr-code.controller';
import { QrCodeDynamique } from './entitie/qr_code_dynamique.entity';
import { QrCodeStatique } from './entitie/qr_code_statique.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CleanupService } from './cleanup.service';
import { ScheduleModule } from '@nestjs/schedule';
import { UserModule } from 'src/utilisateur/user.module';
import { CompteModule } from 'src/compte/compte.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([QrCodeDynamique, QrCodeStatique]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_QR_SECRET', 'qr_code_secret_key'),
        signOptions: { expiresIn: '1h' }, // Valeur par défaut
      }),
    }),
    forwardRef(() => UserModule),
    ScheduleModule.forRoot(),
    forwardRef(() => CompteModule), // Nécessaire pour les tâches programmées
    // Décommentez quand le module d'établissement de santé sera disponible
    // forwardRef(() => EtablissementSanteModule),
  ],
  controllers: [QrCodeController],
  providers: [QrCodeService, CleanupService],
  exports: [QrCodeService]
})
export class QrCodeModule {}