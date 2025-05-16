import { IsString, IsNotEmpty } from 'class-validator';

export class DeleteAccountDto {
  @IsString()
  @IsNotEmpty()
  otp_code: string;

  @IsString()
  @IsNotEmpty()
  raison: string;
}
