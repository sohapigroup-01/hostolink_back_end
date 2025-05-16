
import { IsNotEmpty, IsString } from 'class-validator';

export class PartageInvitationDto {
  @IsNotEmpty()
  @IsString()
  code_invitation: string;
}
