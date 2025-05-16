import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Req,
    UploadedFile,
    UseGuards,
    UseInterceptors,
  } from '@nestjs/common';
  import { ExpertSanteService } from './expert-sante.service';
  import { JwtEtablissementAuthGuard } from '../auth/jwt-etablissement.guard';
import { CreateExpertSanteDto } from './dto/create-expert.dto';
import { JwtExpertGuard } from './guards/jwt-expert.guard';
import { FileInterceptor } from '@nestjs/platform-express';
  
  @Controller('expert-sante')
  export class ExpertSanteController {
    constructor(private readonly expertSanteService: ExpertSanteService) {}
  
    @Post('create')
    @UseGuards(JwtEtablissementAuthGuard)
    async createExpert(
      @Body() dto: CreateExpertSanteDto,
      @Req() req: any,
    ) {
      const idEtab = req.user.id_user_etablissement_sante;
      return this.expertSanteService.creerExpert(dto, idEtab);
    }
    

    @Post('login')
    async loginExpert(
      @Body() body: { identifiant: string; mot_de_passe: string },
    ) {
      return this.expertSanteService.loginExpert(body.identifiant, body.mot_de_passe);
    }
    @Get('me')
    @UseGuards(JwtExpertGuard)
    async getProfile(@Req() req) {
      return this.expertSanteService.getExpertById(req.user.id_expert);
    }


    @Patch('update-password')
    async updatePassword(
      @Body() body: { identifiant: string; ancien_mdp: string; nouveau_mdp: string },
    ) {
      return this.expertSanteService.updatePasswordExpert(
        body.identifiant,
        body.ancien_mdp,
        body.nouveau_mdp,
      );
    }


    @Get('mes-experts')
    @UseGuards(JwtEtablissementAuthGuard)
    async getExpertsByEtablissement(@Req() req) {
      return this.expertSanteService.getExpertsByEtablissement(req.user.id_user_etablissement_sante);
    }

    @Delete(':id')
    @UseGuards(JwtEtablissementAuthGuard)
    async deleteExpert(
      @Param('id') id: number,
      @Req() req,
    ) {
      return this.expertSanteService.deleteExpertByEtablissement(id, req.user.id_user_etablissement_sante);
    }


  @Patch('avatar')
  @UseGuards(JwtExpertGuard)
  @UseInterceptors(FileInterceptor('file'))
  async updateAvatarExpert(
    @UploadedFile() file: Express.Multer.File,
    @Req() req
  ) {
    return this.expertSanteService.updateAvatar(file, req.user.id_expert);
  }

}
  