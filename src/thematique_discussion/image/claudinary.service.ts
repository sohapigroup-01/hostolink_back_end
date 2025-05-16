import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';



@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: 'dhrrk7vsd', // 🔥 Mets ton cloud_name ici
      api_key: '197881586145143',         // 🔥 Mets ta clé API ici
      api_secret: 'HEEz2vCv7MyxBRjCZScbXeUKgEw',  // 🔥 Mets ton API secret ici
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<any> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'messages_expert' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );
      Readable.from(file.buffer).pipe(uploadStream);
    });
  }
}

