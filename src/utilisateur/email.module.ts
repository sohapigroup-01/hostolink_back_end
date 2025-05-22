import { Module } from '@nestjs/common';
import { EmailService } from './email.service';

@Module({
  providers: [EmailService],
  exports: [EmailService], // 👈 Très important pour l’utiliser ailleurs
})
export class EmailModule {}
