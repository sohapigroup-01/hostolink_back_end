import { IsBoolean } from 'class-validator';

export class ActivationUserDto {
  @IsBoolean()
  actif: boolean;
}
