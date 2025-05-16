import { Module } from '@nestjs/common';
import { EmailController } from './dreams-houses-email.controller';
import { EmailService } from './dream-houses-email.service';

@Module({
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
