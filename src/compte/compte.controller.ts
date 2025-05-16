import { Controller, Get, Param } from '@nestjs/common';
import { CompteService } from './compte.service';

@Controller('comptes')
export class CompteController {
  constructor(private readonly compteService: CompteService) {}

  @Get('utilisateur/:id')
  async getUserCompte(@Param('id') id: string) {
    const compte = await this.compteService.getUserCompte(id);
    if (!compte) {
      return {
        success: false,
        message: 'Aucun compte trouvé pour cet utilisateur'
      };
    }
    return {
      success: true,
      data: compte
    };
  }

  /* 
   * CODE POUR LES ÉTABLISSEMENTS DE SANTÉ (À IMPLÉMENTER PLUS TARD)
   * Décommentez ce code quand le module d'établissement de santé sera développé
   */
  /*
  @Get('etablissement/:id')
  async getEtablissementCompte(@Param('id') id: number) {
    const compte = await this.compteService.getEtablissementCompte(id);
    if (!compte) {
      return {
        success: false,
        message: 'Aucun compte trouvé pour cet établissement'
      };
    }
    return {
      success: true,
      data: compte
    };
  }
  */
}