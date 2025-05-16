import { 
  Controller, 
  Post, 
  Get, 
  Param, 
  UploadedFile, 
  UseInterceptors, 
  Delete, 
  Body, 
  Req, 
  UseGuards 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from './image.service';
import { ImageMotifEnum } from './entities/image.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard) 
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Req() req, 
    @Body('motif') motif: ImageMotifEnum,
    @Body('type_user') type_user?: string,
  ) {
    const id_user = req.user.id_user; 

    if (!file) {
      return { success: false, message: "Aucun fichier reçu." };
    }

    const image = await this.imageService.uploadImage(
      file, 
      id_user, 
      motif, 
      type_user, 
    );
    
    return { success: true, image };
  }

  // 📌 Récupérer une image par son ID
  @Get(':id')
  async getImage(@Param('id') id: string) {
    return await this.imageService.getImageById(id);
  }

  // 📌 Récupérer toutes les images
  @Get()
  async getAllImages() {
    return await this.imageService.getAllImages();
  }

  // 📌 Supprimer une image par ID
  @Delete(':id')
  @UseGuards(JwtAuthGuard) 
  async deleteImage(@Param('id') id: string) {
    //console.log("🟡 Suppression de l'image ID :", id);
    return await this.imageService.deleteImage(id);
  }
}
