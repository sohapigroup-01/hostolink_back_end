
// src/Discussion_agent_client/message_assistant_client/message_assistant_client.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageAssistantClient } from './entities/message-assistant-client.entity';
import { MessageService } from './message_assistant_client.service';
import { MessageController } from './message_assistant_client.controller';
import { MessageAssistantClientImage } from '../messages_assistant_client_image/entities/message-assistant-client-image.entity';
import { CloudinaryService } from 'config/cloudinary.config';
import { ConversationsModule } from '../conversations/conversations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MessageAssistantClient, 
      MessageAssistantClientImage
    ]),
    forwardRef(() => ConversationsModule), // Utilisation de forwardRef pour résoudre la dépendance circulaire
  ],
  controllers: [MessageController],
  providers: [
    MessageService, 
    CloudinaryService
  ],
  exports: [MessageService],
})
export class MessageAssistantClientModule {}