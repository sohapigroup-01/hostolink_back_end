import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThematiqueDiscussionController } from './thematique_discussion.controller';
import { Thematique } from './entities/thematique.entity';
import { User } from 'src/utilisateur/entities/user.entity';
import { Administrateur } from 'src/administrateur/entities/administrateur.entity';
import { MessageThematique } from './entities/message_thematique.entity';
import { ThematiqueDiscussionService } from './thematique_message.service';

import { ExpertSante } from 'src/user_etablissement_sante/entities/expert_sante.entity';
import { UploadController } from './image/upload.controller';
import { CloudinaryService } from './image/claudinary.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      Thematique,
      MessageThematique,
      User,
      Administrateur,
      ExpertSante,
    ]),
    
  ],
  controllers: [ThematiqueDiscussionController,UploadController,],
  providers: [ThematiqueDiscussionService,CloudinaryService],
})
export class ThematiqueDiscussionModule {}
