// src/dtos/conversation.dto.ts
import { IsUUID, IsNumber, IsOptional, IsString, IsBoolean } from 'class-validator';
import { MessageResponseDto } from 'src/Discussion_agent_client/message_assistant_client/dto/message.dto';

export class CreateConversationDto {
  @IsUUID()
  @IsOptional()
  userId?: string;

  @IsNumber()
  @IsOptional()
  etablissementSanteId?: number;

  @IsNumber()
  assistantId: number;

  @IsNumber()
  @IsOptional()
  initialQuestionId?: number;
  
  // @IsBoolean()
  // @IsOptional()
  // autoCreated?: boolean = true;
}

export class UpdateConversationDto {
  @IsString()
  @IsOptional()
  status?: string;
}

export class ConversationResponseDto {
  id: number;
  userId?: string;
  etablissementSanteId?: number;
  assistantId: number;
  startTime: Date;
  status: string;
  // autoCreated: boolean;
}

export class ConversationDetailResponseDto extends ConversationResponseDto {
  messages: MessageResponseDto[];
}