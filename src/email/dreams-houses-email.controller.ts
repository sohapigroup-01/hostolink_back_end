import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EmailService } from './dream-houses-email.service';
import { SendMailDto } from './dto/dreams-houses-send-mail.dto';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('envoyer')
  @UseInterceptors(FileInterceptor('file'))
  async envoyer(
    @Body() body: SendMailDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    let imageUrl = body.imageUrl;
    if (file) {
      imageUrl = await this.emailService.uploadImageFromBuffer(file.buffer);
      //console.log('🖼️ URL image envoyée dans l’email :', imageUrl);
    }else{

      //console.log('erreur d envoi');
    }
    
    await this.emailService.sendCustomEmail({ ...body, imageUrl });

    return {
      success: true,
      message: '📩 Email envoyé avec succès',
    };
  }
}
