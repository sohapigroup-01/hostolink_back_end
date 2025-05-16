import { IsOptional, IsString, IsEmail, IsUUID, MaxLength } from 'class-validator';

export class UpdateProfileDto {

  @IsOptional()
  @IsString()
  @MaxLength(100) 
  nom?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  prenom?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  pays?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20) 
  telephone?: string;


}
