import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Administrateur } from './entities/administrateur.entity';
import { Image } from '../image/entities/image.entity';
import { AdministrateurService } from './administrateur.service';
import { AdministrateurController } from './administrateur.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GestionUtilisateurModule } from './Gest_utilisateurs/gestion_utilisateur.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Administrateur, Image]),
    GestionUtilisateurModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [AdministrateurController],
  providers: [
    AdministrateurService,
    {
      provide: 'CLOUDINARY',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const cloudinary = require('cloudinary').v2;
        cloudinary.config({
          cloud_name: configService.get('CLOUDINARY_CLOUD_NAME'),
          api_key: configService.get('CLOUDINARY_API_KEY'),
          api_secret: configService.get('CLOUDINARY_API_SECRET'),
        });
        return cloudinary;
      },
    },
    
  ],
  exports: [AdministrateurService, JwtModule,TypeOrmModule],
})
export class AdministrateurModule {}
