import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageAssistantClient } from '../message_assistant_client/entities/message-assistant-client.entity';
import { MessageController } from '../message_assistant_client/message_assistant_client.controller';
import { MessageService } from '../message_assistant_client/message_assistant_client.service';
import { MessageAssistantClientImage } from '../messages_assistant_client_image/entities/message-assistant-client-image.entity';
import { CloudinaryService } from 'config/cloudinary.config';
import { CloudinaryModule } from 'src/upload/cloudinary.module';
import { QuestionController } from './questions_predefinies.controller';
import { QuestionService } from './questions_predefinies.service';
import { QuestionsPredefinies } from './entities/question-predefinie.entity';
import { ConversationsModule } from '../conversations/conversations.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      QuestionsPredefinies,
      MessageAssistantClient, 
      MessageAssistantClientImage, 
      CloudinaryService, 
      CloudinaryModule,
    ]),
    forwardRef(() => ConversationsModule),
  ],
  controllers: [MessageController, QuestionController],
  providers: [QuestionService, MessageService, CloudinaryService,],
  exports: [QuestionService],
})
export class QuestionsPredefiniesModule {}