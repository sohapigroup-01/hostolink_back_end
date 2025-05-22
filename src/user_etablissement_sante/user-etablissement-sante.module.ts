import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEtablissementSanteService } from './user-etablissement-sante.service';
import { UserEtablissementSanteController } from './user-etablissement-sante.controller';
import { UserEtablissementSante } from './entities/user-etablissement-sante.entity';
import { CodeVerifOtp } from './entities/code-verif-otp.entity';
import { RaisonSuppressionCompte } from './entities/raison-suppression.entity';
import { JwtEtablissementStrategy } from 'src/auth/jwt-etablissement.strategy';
import { Image } from '../image/entities/image.entity';
import { EmailModule } from 'src/utilisateur/email.module';

@Module({
imports: [
  TypeOrmModule.forFeature([UserEtablissementSante, CodeVerifOtp, RaisonSuppressionCompte, Image]),
  EmailModule,
],
  controllers: [UserEtablissementSanteController],
  providers: [UserEtablissementSanteService,JwtEtablissementStrategy],
  exports: [TypeOrmModule], 
})
export class UserEtablissementSanteModule {}
