import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../utilisateur/entities/user.entity';
import { GestUtilisateurController } from './gest_utilisateur.controller';
import { GestUtilisateurService } from './gest_utilisateur.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [GestUtilisateurController],
  providers: [GestUtilisateurService],
})
export class GestionUtilisateurModule {}
