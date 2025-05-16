// src/entities/question-predefinie.entity.ts
import { AgentAssistance } from 'src/agent-assistant/entities/agent-assistance.entity';
import { MessageAssistantClient } from 'src/Discussion_agent_client/message_assistant_client/entities/message-assistant-client.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity('questions_predefinies')
export class QuestionsPredefinies {
  @PrimaryGeneratedColumn({ name: 'question_id' })
  id: number;

  @Column({ name: 'question_text', type: 'text' })
  questionText: string;

  @Column({ name: 'assistant_id' })
  assistantId: number;

  @Column({ name: 'category', length: 255, nullable: true })
  category: string;

  @Column({ name: 'is_active', default: true, nullable: true })
  isActive: boolean;

  @ManyToOne(() => AgentAssistance, assistant => assistant.questions)
  @JoinColumn({ name: 'assistant_id' })
  assistant: AgentAssistance;

  @OneToMany(() => MessageAssistantClient, message => message.questionSugerer)
  messages: MessageAssistantClient[];
}