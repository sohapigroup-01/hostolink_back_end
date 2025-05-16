import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    try {
      const result: UploadApiResponse = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'dossier_hostolink_preset/hostolink/etablissements' },
          (error: UploadApiErrorResponse, result: UploadApiResponse) => {
            if (error) reject(error);
            resolve(result);
          },
        ).end(file.buffer);
      });

      return result.secure_url; // Retourne l'URL de l'image uploadée
    } catch (error) {
      throw new InternalServerErrorException('Erreur lors de l’upload sur Cloudinary.');
    }
  }
}
