// transaction-frais.controller.ts
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { TransactionFraisService } from './transaction-frais.service';
import { JwtAdminGuard } from 'src/auth/jwt-auth.guard';
// Importez RolesGuard si vous avez un système de rôles

@Controller('transaction-frais')
@UseGuards(JwtAdminGuard)
export class TransactionFraisController {
  constructor(private readonly transactionFraisService: TransactionFraisService) {}

  // Récupérer toutes les transactions de frais (protégé, admin uniquement)
  @Get()
  @UseGuards(JwtAdminGuard) // Ajoutez RolesGuard si nécessaire
  async getAllTransactionFrais(@Query('page') page = 1, @Query('limit') limit = 10) {
    return {
      success: true,
      message: 'Transactions de frais récupérées',
      data: await this.transactionFraisService.findAll(page, limit)
    };
  }

  // Récupérer les transactions de frais d'un utilisateur
  @Get('utilisateur/:id_user')
  @UseGuards(JwtAdminGuard)
  async getUserTransactionFrais(
    @Param('id_user') id_user: string,
    @Query('page') page = 1, 
    @Query('limit') limit = 10
  ) {
    return {
      success: true,
      message: `Transactions de frais de l'utilisateur ${id_user} récupérées`,
      data: await this.transactionFraisService.findByUser(id_user, page, limit)
    };
  }

  // Récupérer des statistiques globales (protégé, admin uniquement)
  @Get('statistiques-des-frais')
  @UseGuards(JwtAdminGuard) // Ajoutez RolesGuard si nécessaire
  async getTransactionFraisStats() {
    return {
      success: true,
      message: 'Statistiques des frais de transaction récupérées',
      data: await this.transactionFraisService.getStats()
    };
  }

  // Statistiques pour un utilisateur spécifique
  @Get('stats/utilisateur/:id_user')
  @UseGuards(JwtAdminGuard)
  async getUserTransactionFraisStats(@Param('id_user') id_user: string) {
    return {
      success: true,
      message: `Statistiques des frais de transaction de l'utilisateur ${id_user} récupérées`,
      data: await this.transactionFraisService.getUserStats(id_user)
    };
  }

  // Récupérer une transaction de frais spécifique
  @Get(':id')
  @UseGuards(JwtAdminGuard)
  async getTransactionFraisById(@Param('id') id: number) {
    return {
      success: true,
      message: 'Transaction de frais récupérée',
      data: await this.transactionFraisService.findOne(id)
    };
  }
}