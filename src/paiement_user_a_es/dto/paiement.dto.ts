import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class PaiementDto {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  montant: number;
}
