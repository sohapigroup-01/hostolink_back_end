import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';


export const configureCloudinary = (configService: ConfigService) => {
  cloudinary.config({
    cloud_name: configService.get<string>('CLOUDINARY_CLOUD_NAME'),
    api_key: configService.get<string>('CLOUDINARY_API_KEY'),
    api_secret: configService.get<string>('CLOUDINARY_API_SECRET'),
  });
  
  //console.log('Cloudinary API Key in cloudinary.config.ts:', process.env.CLOUDINARY_API_KEY);
  return cloudinary;
};
// ✅ Ajout de la classe CloudinaryService pour gérer l'upload
@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  // ✅ Fonction pour uploader une image et récupérer son URL
  // ✅ Fonction pour uploader une image sur Cloudinary
  async uploadImage(file: Express.Multer.File): Promise<string> {
    if (!file || !file.buffer) {
      throw new Error('image non télécharger ou invalide');
    }
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ folder: 'numéros_verts' }, (error, result) => {
        if (error) {
          console.error('Cloudinary Upload Error:', error);
          return reject(new Error('Erreur lors de l’upload sur Cloudinary'));
        }

        // ✅ Vérification pour éviter l'erreur 'result' is possibly 'undefined'
        if (!result || !result.secure_url) {
          console.error('Cloudinary Response Undefined:', result);
          return reject(new Error("Cloudinary n'a pas retourné d'URL"));
        }

        //console.log('Image Uploaded to Cloudinary:', result.secure_url);
        resolve(result.secure_url); // ✅ Retourne l'URL de l'image
      }).end(file.buffer);
    });
  }
}