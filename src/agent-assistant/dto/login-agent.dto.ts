// src/agent-assistance/dto/login-agent.dto.ts
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginAgentDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
