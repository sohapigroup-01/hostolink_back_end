import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { QrDynamiqueService } from './qr-dynamique.service_es';
import { JwtEtablissementAuthGuard } from 'src/auth/jwt-etablissement.guard';

@Controller('qr-codes-es')
export class QrDynamiqueController {
  constructor(private readonly service: QrDynamiqueService) {}

  // 🎯 Récupère ou génère automatiquement un QR dynamique actif
  @UseGuards(JwtEtablissementAuthGuard)
  @Get('my-dynamic-es')
  async getMyQr(@Req() req: any) {
    const id = req.user.id_user_etablissement_sante;
    return this.service.getQrActifOuNouveau(id);
  }

  // ✅ Vérifie un QR scanné et l’invalide (usage unique)
  @Post('validate-qr-es')
  async validateQr(@Body('token') token: string) {
    if (!token) throw new BadRequestException('Token requis');
    return this.service.validerQrEtInvalider(token);
  }
}