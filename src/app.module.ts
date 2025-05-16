import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

// ✅ Modules principaux
import { AuthModule } from './auth/auth.module';
import { UserModule } from './utilisateur/user.module';
import { ImageModule } from './image/image.module';
import { CloudinaryModule } from './upload/cloudinary.module';
import { AdministrateurModule } from './administrateur/administrateur.module';
import { GestionUtilisateurModule } from './administrateur/Gest_utilisateurs/gestion_utilisateur.module';
import { InvitationModule } from './invitations/invitation.module';
import { AnnonceModule } from './annonce/annonce.module';
import { ListeNumeroEtablissementSanteModule } from './liste_etablissement/liste_numero_etablissement_sante.module';

// ✅ Santé & Paiement
import { EtablissementSanteModule } from './localisation_etablissement_sante/etablissement_sante.module';
import { UserEtablissementSanteModule } from './user_etablissement_sante/user-etablissement-sante.module';
import { ExpertSanteModule } from './user_etablissement_sante/expert-sante.module';
import { QrDynamiqueModule } from './qr-dynamique_user_es/qr-dynamique.module';
import { PaiementModule } from './paiement_user_a_es/paiement.module';

// ✅ Transactions
import { TransactionFraisModule } from './transaction-frais/transaction-frais.module';
import { TransactionInterneModule } from './transaction-interne/transaction-interne.module';

// ✅ Chat thématique
import { ThematiqueDiscussionModule } from './thematique_discussion/thematique_discussion.module';

// ✅ Agent assistant (chat IA)
import { AgentAssistantModule } from './agent-assistant/agent-assistant.module';
import { QuestionsPredefiniesModule } from './Discussion_agent_client/questions_predefinies/questions_predefinies.module';
import { MessageAssistantClientModule } from './Discussion_agent_client/message_assistant_client/message_assistant_client.module';
import { ConversationsModule } from './Discussion_agent_client/conversations/conversations.module';
import { MessagesAssistantClientImageModule } from './Discussion_agent_client/messages_assistant_client_image/messages_assistant_client_image.module';
// import { SmsService } from './utilisateur/sms.service';

@Module({
  imports: [
    // ✅ Fichiers .env accessibles partout
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),

    // ✅ CRON et tâches planifiées
    ScheduleModule.forRoot(),

    // ✅ Connexion PostgreSQL
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: Number(process.env.DATABASE_PORT) || 5432,
      username: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'postgres',
      database: process.env.DATABASE_NAME || 'hostolink_bd',
      synchronize: false, // ❗️mettre true UNIQUEMENT en dev
      logging: false,
      autoLoadEntities: true,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    }),

    // ✅ Modules fonctionnels
    AuthModule,
    UserModule,
    ImageModule,
    CloudinaryModule,
    AdministrateurModule,
    GestionUtilisateurModule,
    InvitationModule,
    AnnonceModule,
    ListeNumeroEtablissementSanteModule,
    EtablissementSanteModule,
    UserEtablissementSanteModule,
    ExpertSanteModule,
    QrDynamiqueModule,
    PaiementModule,
    TransactionFraisModule,
    TransactionInterneModule,
    ThematiqueDiscussionModule,
    AgentAssistantModule,
    QuestionsPredefiniesModule,
    MessageAssistantClientModule,
    ConversationsModule,
    MessagesAssistantClientImageModule,
  ],
})
export class AppModule {}
