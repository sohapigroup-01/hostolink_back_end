// src/qr-code/dto/validate-qr.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class ValidateQrDto {
  @IsNotEmpty()
  @IsString()
  token: string;
}

// src/qr-code/dto/create-dynamic-qr.dto.ts
import { IsOptional, IsNumber, Min, Max } from 'class-validator';

export class CreateDynamicQrDto {
  @IsOptional()
  @IsNumber()
  @Min(10)
  @Max(3600) // Maximum 1 heure
  duree_validite?: number;
}