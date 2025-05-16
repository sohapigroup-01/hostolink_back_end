import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class LierInviteDto {
  @IsNotEmpty()
  @IsUUID()
  id_user_nouveau: string;

  @IsNotEmpty()
  @IsString()
  code_invitation: string;
}

