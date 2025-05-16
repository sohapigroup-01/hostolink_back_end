import { Body, Controller, Get, NotFoundException, Post, Query, Req, UseGuards } from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApplyBonusDto } from './dto/apply-bonus.dto';
import { PartageInvitationDto } from './dto/partage-invitation.dto';
import { LierInviteDto } from './dto/lier-invite.dto';


@Controller('invitation')
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @UseGuards(JwtAuthGuard)
  @Get('code')
  async getOrCreateInvitation(@Req() request: Request) {
    const user = request.user as { id_user: string };
    const result = await this.invitationService.getOrCreateInvitation(user.id_user);
    return {
      success: true,
      code_invitation: result.code,
      lien_invitation: result.lien,
    };
  }
// enregistrer un clique apres que le nouveau utilisateur est clique sur lien d invitation
  @Get('tracking')
  async enregistrerClicInvitation(
    @Query('code') code: string,
    @Req() req: Request,
  ) {
    if (!code) {
      throw new NotFoundException('Code d\'invitation manquant dans la requête');
    }

    const ip = req.ip || req.headers['x-forwarded-for'] || 'IP inconnue';
    const userAgent = req.headers['user-agent'] || 'Navigateur inconnu';

    await this.invitationService.enregistrerClic(code, ip.toString(), userAgent);

    return { success: true, message: 'Clic enregistré avec succès' };
  }
// le nombre de fois que l utilisateur partage une invitation
  @Post('partager')
async incrementerPartage(@Body() dto: PartageInvitationDto) {
  return await this.invitationService.incrementerNombrePartages(dto.code_invitation);
}
// referencier le niveau utilisateur a celui qui l a invite
// @Post('lier-invite')
// async lierInvite(@Body() dto: LierInviteDto) {
//   return await this.invitationService.lierInviteAuParrain(dto.id_user_nouveau, dto.code_invitation);
// }

 // @Post('apply-bonus')
  // async appliquerBonus(@Body() dto: ApplyBonusDto) {
  //   return await this.invitationService.applyBonus(dto);
  // }
}
