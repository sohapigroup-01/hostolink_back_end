import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ImageService } from 'src/image/image.service'; 
import { Image } from 'src/image/entities/image.entity'; 
import { CompteModule } from 'src/compte/compte.module';
import { QrCodeModule } from 'src/qr-code/qr-code.module';
import { Otp } from './entities/otp.entity';
import { EmailService } from './email.service';
import { OtpCleanerService } from './nettoyeur.service';
import { AuthModule } from 'src/auth/auth.module'; // ✅
import { SmsModule } from './sms.module';
import { EmailModule } from 'src/email/dreams-houses-email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Image, Otp]),
    forwardRef(() => AuthModule),
    SmsModule,
    EmailModule,
    forwardRef(() => CompteModule),
    forwardRef(() => QrCodeModule),
  ],
  controllers: [UserController],
  providers: [UserService, ImageService, EmailService, OtpCleanerService], 
  exports: [UserService, TypeOrmModule], 
})
export class UserModule {}
