import { Controller, Post, Body, UseGuards, Get, Req, Patch, ConflictException, Delete, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { UserEtablissementSanteService } from './user-etablissement-sante.service';
import { CreateUserEtablissementDto } from './dto/create-user-etablissement.dto';
import { UpdateProfileEtablissementDto } from './dto/update-profile.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { DeleteAccountDto } from './dto/delete-account.dto';
import { JwtEtablissementAuthGuard } from 'src/auth/jwt-etablissement.guard';
import { FileInterceptor } from '@nestjs/platform-express';



@Controller('user-etablissement-sante')
export class UserEtablissementSanteController {


  constructor(
    private readonly userEtablissementSanteService: UserEtablissementSanteService,
    private readonly service: UserEtablissementSanteService) {}

  @Post('register')
  register(@Body() dto: CreateUserEtablissementDto) {
    return this.service.register(dto);
  }

  @Post('verify-otp')
  verify(@Body() body: { email: string; code: string }) {
    return this.service.verifyOtp(body.email, body.code);
  }
  
  @UseGuards(JwtEtablissementAuthGuard)
  @Post('logout')
  async logout(@Req() req: any) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new BadRequestException('Token manquant');
    return this.service.logout(token);
  }

  @UseGuards(JwtEtablissementAuthGuard)
  @Get('me')
  async getProfile(@Req() req: any) {
    const id = req.user.id_user_etablissement_sante;
    

    return this.service.getProfile(id);
  }

  @UseGuards(JwtEtablissementAuthGuard)
  @Patch('update-profile')
  updateProfile(@Req() req: any, @Body() dto: UpdateProfileEtablissementDto) {
    const id = req.user.id_user_etablissement_sante;

    return this.service.updateProfile(id, dto);
  }

  @Post('otp/re-generate')
  async regenerateOtp(@Body('identifiant') identifiant: string) {
    if (!identifiant) throw new ConflictException('Identifiant requis');
    return this.service.regenerateOtp(identifiant);
  }


  @Patch('password')
  async changePassword(@Body() dto: UpdatePasswordDto) {
    return this.service.changePasswordWithOtp(dto);
  }

  @UseGuards(JwtEtablissementAuthGuard)
  @Delete('delete-account')
  async deleteAccount(
    @Req() req: any,
    @Body() dto: DeleteAccountDto,
  ) {
    const id = req.user.id_user_etablissement_sante;
    return this.service.deleteAccountWithReason(id, dto);
  }
  
  @UseInterceptors(FileInterceptor('image_profil'))
  @Post('avatar')
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    // Si connecté avec JWT
    const id =
      req.user?.id_user_etablissement_sante ??
      (await this.userEtablissementSanteService.findLastCreatedEtablissementId());
  
    if (!id) throw new BadRequestException('Impossible de déterminer l’établissement');
  
    return this.userEtablissementSanteService.uploadOrUpdateAvatar(id, file);
  }
  

  @UseGuards(JwtEtablissementAuthGuard)
  @UseInterceptors(FileInterceptor('image_profil'))
  @Post('upload-avatar')
  async uploadAvatarAuthenticated(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    const id = req.user.id_user_etablissement_sante;
    if (!file) throw new BadRequestException('Aucun fichier envoyé');
    return this.userEtablissementSanteService.uploadOrUpdateAvatar(id, file);
  }



}
