import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompteService } from './compte.service';
import { CompteController } from './compte.controller';
import { Compte } from './entitie/compte.entity';
import { UserModule } from 'src/utilisateur/user.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Compte]),
    forwardRef(() => UserModule),
    // Décommentez la ligne suivante lorsque le module d'établissement de santé sera développé
    // forwardRef(() => EtablissementSanteModule)
  ],
  controllers: [CompteController],
  providers: [CompteService],
  exports: [CompteService]
})
export class CompteModule {}