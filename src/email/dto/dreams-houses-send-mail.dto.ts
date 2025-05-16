// src/email/dto/send-mail.dto.ts
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendMailDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  message: string;

  @IsNotEmpty()
  @IsString()
  propertyTitle: string;

  @IsNotEmpty()
  @IsString()
  propertyLocation: string;

  @IsNotEmpty()
  @IsString()
  propertyPrice: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  imageUrl?: string;
}
