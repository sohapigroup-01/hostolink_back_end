import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    BadRequestException,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { CloudinaryService } from './cloudinary.service';
  import { Express } from 'express';
  import * as multer from 'multer';
  
  @Controller('upload')
  export class UploadController {
    constructor(private readonly cloudinaryService: CloudinaryService) {}
  
    @Post('annonce-image')
    @UseInterceptors(FileInterceptor('file', {
      storage: multer.memoryStorage(), // Important : garder le fichier en mémoire
      limits: { fileSize: 5 * 1024 * 1024 }, // Limite à 5MB
    }))
    async uploadImageAnnonce(@UploadedFile() file: Express.Multer.File) {
      if (!file) {
        throw new BadRequestException('Aucun fichier reçu');
      }
  
      const uploadedUrl = await this.cloudinaryService.uploadImage(
        file.buffer,
        Date.now().toString(), // nom unique
        'hostolink/annonce_hostolink' // dossier Cloudinary
      );
  
      return { imageUrl: uploadedUrl };
    }
  }
  
