// // src/dtos/message.dto.ts
// import { IsNumber, IsString, IsOptional, IsBoolean, IsArray, ValidateNested } from 'class-validator';
// import { Type } from 'class-transformer';
// import { MessageImageDto, MessageImageResponseDto } from 'src/Discussion_agent_client/messages_assistant_client_image/dto/image_message.dto';

// export class CreateMessageDto {
//   @IsNumber()
//   conversationId: number;

//   @IsString()
//   envoyerPar: string; // 'user' ou 'assistant'

//   @IsString()
//   @IsOptional()
//   messageText?: string;

//   @IsBoolean()
//   @IsOptional()
//   QuestionsPredefinies?: boolean;

//   @IsNumber()
//   @IsOptional()
//   questionSugererId?: number;
// }

// export class CreateMessageWithImageDto extends CreateMessageDto {
//   @IsArray()
//   @ValidateNested({ each: true })
//   @Type(() => MessageImageDto)
//   @IsOptional()
//   images?: MessageImageDto[];
// }

// export class MessageResponseDto {
//   id: number;
//   conversationId: number;
//   envoyerPar: string;
//   messageText: string;
//   sentAt: Date;
//   QuestionsPredefinies: boolean;
//   questionSugererId?: number;
//   hasFile: boolean;
//   images?: MessageImageResponseDto[];
// }

// src/dtos/message.dto.ts
import { IsNumber, IsOptional, IsString, IsArray, IsUUID, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class ImageDto {
  @IsString()
  imageUrl: string;

  @IsString()
  @IsOptional()
  altText?: string;
}

export class CreateMessageDto {
  @IsNumber()
  @IsOptional()
  conversationId?: number;

  @IsUUID()
  @IsOptional()
  userId?: string;

  @IsNumber()
  @IsOptional()
  etablissementSanteId?: number;

  @IsNumber()
  @IsOptional()
  assistantId?: number;

  @IsString()
  envoyerPar: string;

  @IsString()
  messageText: string;

  @IsNumber()
  @IsOptional()
  questionSugererId?: number;
  
  @IsBoolean()
  @IsOptional()
  QuestionsPredefinies?: boolean;
}

export class CreateMessageWithImageDto extends CreateMessageDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImageDto)
  @IsOptional()
  images?: ImageDto[];
}

export class MessageResponseDto {
  id: number;
  conversationId: number;
  envoyerPar: string;
  messageText: string;
  sentAt: Date;
  hasFile: boolean;
  questionSugererId?: number;
  questionSugerer?: any;
  images?: any[];
}