// transaction.controller.ts
import { Controller, Get, Post, Body, Param, Req, UseGuards, NotFoundException, BadRequestException, Inject, forwardRef, ParseIntPipe, InternalServerErrorException } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { JwtAdminGuard, JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { TransactionInterneService } from './transaction-interne.service';
import { PayWithQrDto } from './payer-avec/payer-avec-qr.dto';
import { PayWithPhoneDto } from './payer-avec/payer-avec-telephone.dto';
import { RollbackTransactionDto } from './rollback-dto/rollback-transaction.dto';
import { PayWithEmailDto } from './payer-avec/payer-avec-email.dto';

@Controller('transaction')
export class TransactionInterneController {
  constructor(
    private readonly TransactionInterneService: TransactionInterneService,
    private readonly moduleRef: ModuleRef
  ) {}

  @Get('mes_transactions')
   @UseGuards(JwtAuthGuard)
  async getMyTransactions(@Req() req) {
    return this.TransactionInterneService.getMyTransactions(req.user.id_user);
  }

  @Get('statistiques-des-transactions')
  @UseGuards(JwtAdminGuard)
  async getTransactionStats() {
    return {
      success: true,
      message: 'Statistiques des transactions récupérées',
      data: await this.TransactionInterneService.getStats()
    };
  }
  


  
  @Get(':id')
  @UseGuards(JwtAdminGuard)
  async getTransactionById(@Param('id') id: string, @Req() req) {
    const transaction = await this.TransactionInterneService.getTransactionById(+id);
    
    // Vérifier que l'utilisateur a accès à cette transaction
    if (transaction.id_utilisateur_envoyeur !== req.user.id_user && 
        transaction.id_utilisateur_recepteur !== req.user.id_user) {
      throw new BadRequestException('Vous n\'avez pas accès à cette transaction');
    }
    
    return transaction;
  }

  // transaction via qr code
  @Post('paiement_qrcode')
  @UseGuards(JwtAuthGuard)
  async payWithQr(@Req() req, @Body() payWithQrDto: PayWithQrDto) {
    return this.TransactionInterneService.createTransactionFromQrCode(req.user.id_user, payWithQrDto);
  }

  // transaction via numero de téléphone
  @Post('paiement_telephone')
  @UseGuards(JwtAuthGuard)
  async payWithPhone(@Req() req, @Body() payWithPhoneDto: PayWithPhoneDto) {
    return this.TransactionInterneService.createTransactionFromPhone(req.user.id_user, payWithPhoneDto);
  }

  // transaction via email
  @Post('/paiement_email')
  @UseGuards(JwtAuthGuard)
  async payWithEmail(@Req() req, @Body() payWithEmailDto: PayWithEmailDto) {
    try {
      const userId = req.user.id_user;
      
      // Validation des entrées
      if (!payWithEmailDto.email || !payWithEmailDto.montant_envoyer) {
        throw new BadRequestException('L\'email du destinataire et le montant sont requis');
      }

      // Vérifier si l'email est un email Gmail valide
      const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
      if (!gmailRegex.test(payWithEmailDto.email)) {
        throw new BadRequestException('Veuillez fournir une adresse Gmail valide');
      }

       // Vérifier si l'email est un email Gmail
    const isGmailEmail = payWithEmailDto.email.toLowerCase().endsWith('@gmail.com');
    if (!isGmailEmail) {
      throw new BadRequestException('Seules les adresses email Gmail sont acceptées pour le moment');
    }

      // Validation du montant
      if (payWithEmailDto.montant_envoyer <= 499) {
        throw new BadRequestException('Le montant doit être supérieur à 500 F CFA');
      }

      return this.TransactionInterneService.createTransactionFromEmail(
        userId,
        payWithEmailDto
      );
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(`Erreur lors du paiement via email: ${error.message}`);
    }
}


  //ces parties sont reservées à l'administrateur et elles permettent de bloqué et d'annulé une transaction mais 

  @Post(':id/bloque_transaction') // bloque la transaction encore en attente
  @UseGuards(JwtAdminGuard)
  async cancelTransaction(@Param('id') id: string, @Req() req) {
    return this.TransactionInterneService.cancelTransaction(+id, req.user.id_user);
  }
  
  @Post(':id/annule_transaction') // rollback // annule une transaction
  @UseGuards(JwtAdminGuard)
  async rollbackTransaction(
    @Param('id') id: string, 
    @Req() req, 
    @Body() rollbackDto: RollbackTransactionDto
  ) {
    return this.TransactionInterneService.rollbackTransaction(+id, req.user.id_user, rollbackDto);
  }



  // endpoints pour recuprer les statistiques des transactions d'un utilisateur

// @Get('stats/utilisateur/:id_user')
// @UseGuards(JwtAdminGuard)
// async getUserTransactionStats(@Param('id_user') id_user: string) {
//   return {
//     success: true,
//     message: `Statistiques des transactions de l'utilisateur ${id_user} récupérées`,
//     data: await this.TransactionInterneService.getUserStats(id_user)
//   };
// }



@Post('info_qrcode')
@UseGuards(JwtAuthGuard)
async getUserInfoFromQrCode(@Body('token') token: string) {
  return this.TransactionInterneService.getUserInfoFromQrCode(token);
}



}