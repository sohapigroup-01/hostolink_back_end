import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ApplyBonusDto {
  @IsNotEmpty()
  @IsString()
  code_invitation: string;

  @IsNotEmpty()
  @IsUUID()
  id_user_nouveau: string;
}

