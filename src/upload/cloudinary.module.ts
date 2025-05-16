import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { UploadController } from './upload.controller';




@Module({
  controllers: [UploadController],
  providers: [CloudinaryService], // ✅ Déclare le service
  exports: [CloudinaryService],   // ✅ Exporte le service pour que les autres modules puissent l'utiliser
})
export class CloudinaryModule {}
