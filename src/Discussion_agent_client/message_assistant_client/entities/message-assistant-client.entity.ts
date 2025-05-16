// src/entities/message-assistant-client.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Conversation } from '../../conversations/entities/conversation.entity';
import { QuestionsPredefinies } from '../../questions_predefinies/entities/question-predefinie.entity';
import { MessageAssistantClientImage } from '../../messages_assistant_client_image/entities/message-assistant-client-image.entity';


@Entity('messages_assistant_client')
export class MessageAssistantClient {
  @PrimaryGeneratedColumn({ name: 'message_id' })
  id: number;

  @Column({ name: 'conversation_id' })
  conversationId: number;

  @Column({ name: 'envoyer_par', length: 50 })
  envoyerPar: string;

  @Column({ name: 'message_text', type: 'text', nullable: true })
  messageText: string;

  @Column({ name: 'sent_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  sentAt: Date;

  @Column({ name: 'question_predefinie', default: false })
  QuestionsPredefinies: boolean;

  @Column({ name: 'question_sugerer', nullable: true })
  questionSugererId: number;

  @Column({ name: 'has_file', default: false })
  hasFile: boolean;

  @ManyToOne(() => Conversation, conversation => conversation.messages)
  @JoinColumn({ name: 'conversation_id' })
  conversation: Conversation;

  @ManyToOne(() => QuestionsPredefinies, question => question.messages, { nullable: true })
  @JoinColumn({ name: 'question_sugerer' })
  questionSugerer: QuestionsPredefinies;

  @OneToMany(() => MessageAssistantClientImage, image => image.message, { cascade: true })
  images: MessageAssistantClientImage[];
}