// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { CommentaireController } from './commentaire.controller';
// import { CommentaireService } from './commentaire.service';
// import { Commentaire } from './entities/commentaire.entity';
// import { Publication } from 'src/publication/entities/publication.entity';
// import { User } from 'src/utilisateur/entities/user.entity';

// @Module({
//   imports: [TypeOrmModule.forFeature([Commentaire, User, Publication])],
//   controllers: [CommentaireController],
//   providers: [CommentaireService],
//   exports: [CommentaireService]
// })
// export class CommentaireModule {}