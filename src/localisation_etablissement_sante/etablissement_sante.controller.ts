import { Controller, Get, Post, Param, Body, Query, BadRequestException, UsePipes, ValidationPipe, ParseIntPipe, Put, Delete } from '@nestjs/common';
import { EtablissementSanteService } from './etablissement_sante.service';
import { EtablissementSante } from './entities/etablissement_sante.entity';
import { FindNearbyDto } from './dto/etablissement_sante.dto';
import { UpdateEtablissementDto } from './dto/update-etablissement.dto';

@Controller('etablissements')
export class EtablissementSanteController {
  constructor(private readonly etablissementSanteService: EtablissementSanteService) {}

  @Post()
  async create(@Body() data: Partial<EtablissementSante>): Promise<EtablissementSante> {
    return this.etablissementSanteService.createEtablissement(data);
  }

  @Get()
  async findAll(): Promise<EtablissementSante[]> {
    return this.etablissementSanteService.findAll();
  }
  @Get('proches')
  @UsePipes(new ValidationPipe({ transform: true })) 
  async findNearby(@Query() query: FindNearbyDto): Promise<EtablissementSante[]> {
    return this.etablissementSanteService.findNearby(query.lat, query.lng, query.distance);
  }

  @Get('proches/categorie')
    @UsePipes(new ValidationPipe({ transform: true }))

    async findNearbyByCategory(
    @Query() findNearbyDto: FindNearbyDto,
    @Query('categorie') categorie: string,
    ): Promise<EtablissementSante[]> {

    if (!categorie) {
        throw new BadRequestException('La catégorie doit être spécifiée.');
    }

    return this.etablissementSanteService.findNearbyByCategory(
        findNearbyDto.lat,
        findNearbyDto.lng,
        findNearbyDto.distance,
        categorie, 
    );
    }

    @Get('recherche')
    async findByName(
    @Query('nom') nom: string,
    ): Promise<EtablissementSante[]> {
    if (!nom) {
        throw new BadRequestException('Le nom de l’établissement doit être spécifié.');
    }

    return this.etablissementSanteService.findByName(nom);
    }

    // Mettre à jour un établissement existant
    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateData: UpdateEtablissementDto,
      ): Promise<EtablissementSante> {
      return this.etablissementSanteService.updateEtablissement(id, updateData);
    }

    @Delete(':id')
      async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
        await this.etablissementSanteService.deleteEtablissement(id);
        return { message: `Établissement avec l'ID ${id} supprimé avec succès.` };
    }

  
  @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<EtablissementSante | null> {
      
      return this.etablissementSanteService.findOne(id);
  }

 
}
