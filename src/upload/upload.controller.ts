import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('upload-image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadLogo(@UploadedFile() file: Express.Multer.File) {
    //console.log('Requête reçue pour upload', file);
    
    if (!file) {
      throw new Error('Aucun fichier reçu. Vérifiez votre requête.');
    }

    const imageUrl = await this.cloudinaryService.uploadImage(file);
    return {
      message: 'Image uploadée avec succès',
      imageUrl,
    };
  }
}
