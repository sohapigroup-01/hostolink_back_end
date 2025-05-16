// src/entities/message-assistant-client-image.entity.ts
import { MessageAssistantClient } from 'src/Discussion_agent_client/message_assistant_client/entities/message-assistant-client.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
// import { MessageAssistantClient } from './message-assistant-client.entity';

@Entity('messages_assistant_client_image')
export class MessageAssistantClientImage {
  @PrimaryGeneratedColumn({ name: 'image_id' })
  id: number;

  @Column({ name: 'message_id' })
  messageId: number;

  @Column({ name: 'image_url', type: 'text' })
  imageUrl: string;

  @Column({ name: 'alt_text', type: 'text', nullable: true })
  altText: string;

  @Column({ name: 'uploaded_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: true })
  uploadedAt: Date;

  @ManyToOne(() => MessageAssistantClient, message => message.images)
  @JoinColumn({ name: 'message_id' })
  message: MessageAssistantClient;
}