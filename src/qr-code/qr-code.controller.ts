import { Controller, Post, Get, Body, Param, UseGuards, Req } from '@nestjs/common';
import { QrCodeService } from './qr-code.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('qr-codes')
@UseGuards(JwtAuthGuard)
export class QrCodeController {
  constructor(private readonly qrCodeService: QrCodeService) {}

  /**
   * Génère un QR code dynamique pour l'utilisateur connecté
   */
  @Post('dynamic')
  @UseGuards(JwtAuthGuard)
  async generateDynamicQrCode(@Req() req, @Body() body: { expiresIn?: number }) {
    // //console.log('Request received for dynamic QR code');
    const id_user = req.user.id_user;
    const expiresIn = body.expiresIn || 60; // Par défaut 60 secondes
    
    // Récupérer le compte utilisateur pour obtenir le numéro de compte
    const compte = await this.qrCodeService['compteService'].getUserCompte(id_user);
    const accountNumber = compte ? compte.numero_compte : undefined;
    const currency = compte ? compte.devise : undefined;
    
    // Utiliser ou mettre à jour un QR code existant
    const qrCode = await this.qrCodeService.refreshUserDynamicQrCode(
      id_user,
      accountNumber,
      expiresIn,
      currency
    );
    
    if (!qrCode) {
      return {
        success: false,
        message: 'Erreur lors de la génération du QR code dynamique',
      };
    }
    
    // Générer l'URL de l'image QR code avec l'identifiant court
    const qrCodeImageUrl = await this.qrCodeService.generateQrCodeImage(qrCode.short_id);
    
    // Calculer le temps restant
    const now = new Date();
    const remainingTime = Math.floor((qrCode.date_expiration.getTime() - now.getTime()) / 1000);
    
    return {
      success: true,
      message: 'QR code dynamique généré avec succès',
      data: {
        id_qrcode: qrCode.id_qrcode,
        short_id: qrCode.short_id,
        token: qrCode.token,
        date_expiration: qrCode.date_expiration,
        remaining_seconds: remainingTime > 0 ? remainingTime : 0,
        qr_code_image: qrCodeImageUrl,
      }
    };
  }

  /**
   * Récupère le QR code statique de l'utilisateur connecté
   */
  @Get('static')
  @UseGuards(JwtAuthGuard)
  async getStaticQrCode(@Req() req) {
    const id_user = req.user.id_user;
    
    // Récupérer le compte utilisateur pour obtenir le numéro de compte
    const compte = await this.qrCodeService['compteService'].getUserCompte(id_user);
    const accountNumber = compte ? compte.numero_compte : undefined;
    
    // Utiliser la méthode du service pour obtenir le QR code statique
    let qrCode = await this.qrCodeService.getUserStaticQrCode(id_user);
    
    if (!qrCode) {
      // Si aucun QR code statique n'existe, en créer un nouveau
      qrCode = await this.qrCodeService.createStaticQrForNewUser(id_user, accountNumber);
    }
    
    // Générer l'URL de l'image QR code avec l'identifiant court
    const qrCodeImageUrl = await this.qrCodeService.generateQrCodeImage(qrCode.short_id);
    
    return {
      success: true,
      message: 'QR code statique récupéré',
      data: {
        id_qrcode: qrCode.id_qrcode,
        short_id: qrCode.short_id,
        token: qrCode.token,
        qr_code_image: qrCodeImageUrl,
      }
    };
  }

  /**
   * Récupère le QR code dynamique actif de l'utilisateur connecté
   * ATTENTION: Cette route doit être définie AVANT la route générique ':type/:id_qrcode'
   */
  @Get('my-dynamic')
  @UseGuards(JwtAuthGuard)
  async getMyDynamicQrCode(@Req() req) {
    const id_user = req.user.id_user;
    
    // Récupérer les QR codes dynamiques (qui seront automatiquement mis à jour si expirés)
    const dynamicQrCodes = await this.qrCodeService.getUserDynamicQrCodes(id_user);
    
    // Prendre le QR code le plus récent
    const latestQrCode = dynamicQrCodes[0];
    
    // Générer l'image du QR code avec l'identifiant court
    const qrCodeImageUrl = await this.qrCodeService.generateQrCodeImage(latestQrCode.short_id);
    
    // Calculer le temps restant en secondes
    const now = new Date();
    const remainingTime = Math.floor((latestQrCode.date_expiration.getTime() - now.getTime()) / 1000);
    
    return {
      success: true,
      message: 'QR code dynamique récupéré',
      data: {
        id_qrcode: latestQrCode.id_qrcode,
        short_id: latestQrCode.short_id,
        token: latestQrCode.token,
        date_expiration: latestQrCode.date_expiration,
        remaining_seconds: remainingTime > 0 ? remainingTime : 0,
        qr_code_image: qrCodeImageUrl,
      }
    };
  }

  // /**
  //  * Valide un QR code à partir de son identifiant court ou de son token
  //  */


  @Post('valider_qr_code')
  async validateQrCode(@Body() body: { token: string }) {
    try {
      const validationResult = await this.qrCodeService.validateQrCode(body.token);
      
      return {
        success: true,
        message: 'QR code valide',
        data: validationResult
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Erreur lors de la validation du QR code',
        data: null
      };
    }
  }



 // Endpoint pour rafraîchir tous les QR codes statiques
 @Post('rafrechir-qrcode-static')
 async refreshAllStaticQrCodes(): Promise<number> {
   return this.qrCodeService.refreshAllStaticQrCodes();
 }



  /**
   * Rafraîchit le QR code dynamique de l'utilisateur connecté
   */
  @Post('rafrechir-qrcode-dynamic')
  @UseGuards(JwtAuthGuard)
  async refreshDynamicQrCode(@Req() req, @Body() body: { expiresIn?: number }) {
    const id_user = req.user.id_user;
    const expiresIn = body.expiresIn || 60; // Par défaut 60 secondes
    
    // Récupérer le compte utilisateur pour obtenir le numéro de compte
    const compte = await this.qrCodeService['compteService'].getUserCompte(id_user);
    const accountNumber = compte ? compte.numero_compte : undefined;
    const currency = compte ? compte.devise : undefined;
    
    const qrCode = await this.qrCodeService.refreshUserDynamicQrCode(
      id_user,
      accountNumber,
      expiresIn,
      currency
    );
    
    // Générer l'URL de l'image QR code avec l'identifiant court
    const qrCodeImageUrl = await this.qrCodeService.generateQrCodeImage(qrCode.short_id);
    
    // Calculer le temps restant
    const now = new Date();
    const remainingTime = Math.floor((qrCode.date_expiration.getTime() - now.getTime()) / 1000);
    
    return {
      success: true,
      message: 'QR code dynamique rafraîchi avec succès',
      data: {
        id_qrcode: qrCode.id_qrcode,
        short_id: qrCode.short_id,
        token: qrCode.token,
        date_expiration: qrCode.date_expiration,
        remaining_seconds: remainingTime > 0 ? remainingTime : 0,
        qr_code_image: qrCodeImageUrl,
      }
    };
  }

  /**
   * Récupère tous les QR codes (statiques et dynamiques) de l'utilisateur connecté
   */
  @Get('les-deux-qr-codes')
  @UseGuards(JwtAuthGuard)
  async getAllUserQrCodes(@Req() req) {
    const id_user = req.user.id_user;
    
    const allQrCodes = await this.qrCodeService.getAllUserQrCodes(id_user);
    
    // Ajouter les images QR code aux codes statiques
    const staticQrCodesWithImages = await Promise.all(
      allQrCodes.static.map(async (qrCode) => {
        const qrCodeImageUrl = await this.qrCodeService.generateQrCodeImage(qrCode.short_id);
        return {
          ...qrCode,
          qr_code_image: qrCodeImageUrl
        };
      })
    );
    
    // Ajouter les images QR code et calculer le temps restant pour les codes dynamiques
    const dynamicQrCodesWithImages = await Promise.all(
      allQrCodes.dynamic.map(async (qrCode) => {
        const qrCodeImageUrl = await this.qrCodeService.generateQrCodeImage(qrCode.short_id);
        const now = new Date();
        const remainingTime = Math.floor((qrCode.date_expiration.getTime() - now.getTime()) / 1000);
        return {
          ...qrCode,
          remaining_seconds: remainingTime > 0 ? remainingTime : 0,
          qr_code_image: qrCodeImageUrl
        };
      })
    );
    
    return {
      success: true,
      message: 'Tous les QR codes récupérés',
      data: {
        static: staticQrCodesWithImages,
        dynamic: dynamicQrCodesWithImages
      }
    };
  }

  /**
   * Récupère les QR codes d'un utilisateur spécifique (requiert des droits d'admin)
   */
  @Get('utilisateur/:id_user')
  @UseGuards(JwtAuthGuard)
  async getUserQrCodes(@Param('id_user') id_user: string) {
    const allQrCodes = await this.qrCodeService.getAllUserQrCodes(id_user);
    
    // Ajouter les images QR code
    const staticQrCodesWithImages = await Promise.all(
      allQrCodes.static.map(async (qrCode) => {
        const qrCodeImageUrl = await this.qrCodeService.generateQrCodeImage(qrCode.short_id);
        return {
          ...qrCode,
          qr_code_image: qrCodeImageUrl
        };
      })
    );
    
    const dynamicQrCodesWithImages = await Promise.all(
      allQrCodes.dynamic.map(async (qrCode) => {
        const qrCodeImageUrl = await this.qrCodeService.generateQrCodeImage(qrCode.short_id);
        const now = new Date();
        const remainingTime = Math.floor((qrCode.date_expiration.getTime() - now.getTime()) / 1000);
        return {
          ...qrCode,
          remaining_seconds: remainingTime > 0 ? remainingTime : 0,
          qr_code_image: qrCodeImageUrl
        };
      })
    );
    
    return {
      success: true,
      message: `QR codes de l'utilisateur ${id_user} récupérés`,
      data: {
        static: staticQrCodesWithImages,
        dynamic: dynamicQrCodesWithImages
      }
    };
  }

  /**
   * Récupère un QR code spécifique par son ID
   * ATTENTION: Cette route doit être définie EN DERNIER, car elle utilise des paramètres dynamiques
   * qui pourraient intercepter d'autres routes
   */
  @Get(':type/:id_qrcode')
  async getQrCodeById(@Param('type') type: string, @Param('id_qrcode') id_qrcode: number) {
    if (type !== 'static' && type !== 'dynamic') {
      return {
        success: false,
        message: 'Type de QR code invalide. Utilisez "static" ou "dynamic"'
      };
    }
    
    const qrCode = await this.qrCodeService.getQrCodeById(id_qrcode, type as 'static' | 'dynamic');
    
    if (!qrCode) {
      return {
        success: false,
        message: 'QR code non trouvé'
      };
    }
    
    // Générer l'image QR code avec l'identifiant court
    const qrCodeImageUrl = await this.qrCodeService.generateQrCodeImage(qrCode.short_id);
    
    // Calculer le temps restant pour les QR codes dynamiques
    let remainingSeconds: number | undefined = undefined;
    if (type === 'dynamic' && 'date_expiration' in qrCode) {
      const now = new Date();
      const remainingTime = Math.floor((qrCode.date_expiration.getTime() - now.getTime()) / 1000);
      remainingSeconds = remainingTime > 0 ? remainingTime : 0;
    }
    
    return {
      success: true,
      message: 'QR code récupéré',
      data: {
        ...qrCode,
        remaining_seconds: remainingSeconds,
        qr_code_image: qrCodeImageUrl
      }
    };
  }
}