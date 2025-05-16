import { Module } from '@nestjs/common';
import { MessagesAssistantClientImageService } from './messages_assistant_client_image.service';
import { MessagesAssistantClientImageController } from './messages_assistant_client_image.controller';

@Module({
  providers: [MessagesAssistantClientImageService],
  controllers: [MessagesAssistantClientImageController]
})
export class MessagesAssistantClientImageModule {}
