// src/dtos/question.dto.ts
import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  questionText: string;

  @IsNumber()
  assistantId: number;

  @IsString()
  @IsOptional()
  category?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateQuestionDto {
  @IsString()
  @IsOptional()
  questionText?: string;

  @IsNumber()
  @IsOptional()
  assistantId?: number;

  @IsString()
  @IsOptional()
  category?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class QuestionResponseDto {
  id: number;
  questionText: string;
  assistantId: number;
  category: string;
  isActive: boolean;
}