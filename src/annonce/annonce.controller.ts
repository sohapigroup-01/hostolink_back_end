import { Controller, Post, Body, Param, Put, Delete, Get, UseGuards, BadRequestException, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AnnonceService } from './annonce.service';
import { CreateAnnonceDto } from './dto/create-annonce.dto';
import { UpdateAnnonceDto } from './dto/update-annoce.dto';

import { FileInterceptor } from '@nestjs/platform-express/multer';
import { CloudinaryService } from './image/cloudinary.service';

@Controller('annonces')
export class AnnonceController {
  constructor(private readonly annonceService: AnnonceService,
  private readonly cloudinaryService: CloudinaryService

  ) {}

  @Post()
  // @UseGuards(JwtAdminGuard) 
  async createAnnonce(@Body() dto: CreateAnnonceDto) {
    //console.log('📥 Requête reçue à', new Date());
    return this.annonceService.createAnnonce(dto);
  }
  
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Aucune image envoyée');
    }

    const secureUrl = await this.cloudinaryService.uploadImage(
      file.buffer,
      `annonce_${Date.now()}`,
      'hostolink/annonce_hostolink',
    );

    return { secureUrl };
  }


  @Get()
  // @UseGuards(JwtAdminGuard) 
  async getAllAnnonces() {
    //console.log(`📩 tous recup annonce `);
    return this.annonceService.getAllAnnonces();
  }

  
  @Put(':id')
  // @UseGuards(JwtAdminGuard) 
  async updateAnnonce(@Param('id') id: number, @Body() dto: UpdateAnnonceDto) {
    return this.annonceService.updateAnnonce(id, dto);
  }
 
  @Delete(':id')
  // @UseGuards(JwtAdminGuard) 
  async deleteAnnonce(@Param('id') id: number) {
    return this.annonceService.deleteAnnonce(id);
  }

}
