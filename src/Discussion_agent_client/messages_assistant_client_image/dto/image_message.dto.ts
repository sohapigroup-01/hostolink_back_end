// src/dtos/image.dto.ts
import { IsNumber, IsString, IsOptional, IsUrl } from 'class-validator';

export class MessageImageDto {
  @IsUrl()
  imageUrl: string;

  @IsString()
  @IsOptional()
  altText?: string;
}

export class CreateImageDto {
  @IsNumber()
  messageId: number;

  @IsString()
  @IsUrl()
  imageUrl: string;

  @IsString()
  @IsOptional()
  altText?: string;
}

export class MessageImageResponseDto {
  id: number;
  messageId: number;
  imageUrl: string;
  altText?: string;
  uploadedAt: Date;
}