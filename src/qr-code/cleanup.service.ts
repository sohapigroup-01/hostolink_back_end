
import { forwardRef, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, In } from 'typeorm';
import { QrCodeDynamique } from './entitie/qr_code_dynamique.entity';
import { QrCodeService } from './qr-code.service';

@Injectable()
export class CleanupService implements OnModuleInit {
  private readonly logger = new Logger(CleanupService.name);
  private qrCodeUpdateTimers = new Map<number, NodeJS.Timeout>();
  
  constructor(
    @Inject(forwardRef(() => QrCodeService))
    private readonly qrCodeService: QrCodeService,

    @InjectRepository(QrCodeDynamique)
    private readonly qrCodeDynamiqueRepository: Repository<QrCodeDynamique>,
  ) {}

  /**
   * Au démarrage de l'application, planifier la mise à jour de tous les QR codes actifs
   */
  async onModuleInit() {
    // this.logger.log('Initialisation du service de mise à jour des QR codes');
    await this.scheduleAllActiveQrCodeUpdates();
  }

  /**
   * Charge tous les QR codes actifs et planifie leur mise à jour exactement
   * à leur date d'expiration
   */
  async scheduleAllActiveQrCodeUpdates() {
    try {
      const activeQrCodes = await this.qrCodeDynamiqueRepository.find({
        where: { statut: 'actif' }
      });

      // this.logger.log(`Planification de la mise à jour pour ${activeQrCodes.length} QR codes actifs`);
      
      for (const qrCode of activeQrCodes) {
        this.scheduleQrCodeUpdate(qrCode);
      }
    } catch (error) {
      // this.logger.error(`Erreur lors du chargement initial des QR codes: ${error.message}`);
    }
  }

  /**
   * Planifie la mise à jour d'un QR code exactement à sa date d'expiration
   */
  scheduleQrCodeUpdate(qrCode: QrCodeDynamique) {
    // Annuler toute mise à jour déjà planifiée pour ce QR code
    if (this.qrCodeUpdateTimers.has(qrCode.id_qrcode)) {
      clearTimeout(this.qrCodeUpdateTimers.get(qrCode.id_qrcode));
      this.qrCodeUpdateTimers.delete(qrCode.id_qrcode);
    }
    
    const now = new Date().getTime();
    const expirationTime = qrCode.date_expiration.getTime();
    
    // Calculer le délai en millisecondes jusqu'à l'expiration
    let delay = expirationTime - now;
    
    // Si déjà expiré ou délai trop court, mettre à jour immédiatement
    if (delay <= 0) {
      this.updateQrCodeToken(qrCode.id_qrcode);
      return;
    }
    
    // Planifier la mise à jour exactement à l'expiration
    const timerId = setTimeout(() => {
      this.updateQrCodeToken(qrCode.id_qrcode);
    }, delay);
    
    // Stocker le timer pour pouvoir l'annuler si nécessaire
    this.qrCodeUpdateTimers.set(qrCode.id_qrcode, timerId);
    
    // this.logger.debug(`QR code ${qrCode.id_qrcode} programmé pour mise à jour dans ${delay/1000} secondes`);
  }

  /**
   * Met à jour un QR code spécifique quand il expire
   */
  async updateQrCodeToken(qrCodeId: number) {
    try {
      // Récupérer le QR code
      const qrCode = await this.qrCodeDynamiqueRepository.findOne({
        where: { id_qrcode: qrCodeId }
      });
      
      if (!qrCode || qrCode.statut !== 'actif') {
        // Supprimer le timer si le QR code n'existe plus ou est inactif
        this.qrCodeUpdateTimers.delete(qrCodeId);
        return;
      }
      
      // Récupérer les informations du compte
      const compte = await this.qrCodeService['compteService'].getUserCompte(qrCode.id_user);
      
      // Créer un nouveau payload et générer un token
      const payload = this.qrCodeService.createUserPayload(
        qrCode.id_user, 
        true, 
        60, // 1 minute
        { 
          accountNumber: compte?.numero_compte,
          currency: compte?.devise
        }
      );
      const token = this.qrCodeService.generateTokenWithPayload(payload);
      
      // Mettre à jour le QR code existant
      qrCode.token = token;
      qrCode.date_expiration = new Date(payload.expiresAt || Date.now() + (60 * 1000));
      
      // Sauvegarder les modifications
      await this.qrCodeDynamiqueRepository.save(qrCode);
      
      // this.logger.log(`Token du QR code ${qrCodeId} mis à jour avec succès`);
      
      // Reprogrammer la prochaine mise à jour
      this.scheduleQrCodeUpdate(qrCode);
      
    } catch (error) {
      // this.logger.error(`Erreur lors de la mise à jour du QR code ${qrCodeId}: ${error.message}`);
      // Supprimer le timer en cas d'erreur
      this.qrCodeUpdateTimers.delete(qrCodeId);
    }
  }

  /**
   * Tâche programmée pour nettoyer les QR codes très anciens
   * S'exécute tous les jours à minuit
   */
  @Cron('0 0 * * *')
  async scheduledCleanup() {
    // this.logger.log('Début du nettoyage programmé des QR codes très anciens');
    
    // Supprimer uniquement les QR codes expirés depuis très longtemps (7 jours par défaut)
    const deletedCount = await this.qrCodeService.deleteOldExpiredQrCodes(7);
    this.logger.log(`${deletedCount} QR codes dynamiques très anciens supprimés`);
    
    // this.logger.log('Nettoyage programmé terminé');
  }

  /**
   * Désactive tous les QR codes dynamiques expirés
   */
  // async deactivateExpiredQrCodes(): Promise<void> {
  //   const now = new Date();
    
  //   const result = await this.qrCodeDynamiqueRepository.update(
  //     { 
  //       statut: 'actif',
  //       date_expiration: LessThan(now)
  //     },
  //     { 
  //       statut: 'inactif' 
  //     }
  //   );
    
    // this.logger.log(`${result.affected} QR codes dynamiques expirés ont été désactivés`);
  // }

  async deactivateExpiredQrCodes(): Promise<void> {
    const now = new Date();
  
    // 1. Récupérer les utilisateurs affectés AVANT mise à jour
    const expiredCodes = await this.qrCodeDynamiqueRepository.find({
      where: {
        statut: 'actif',
        date_expiration: LessThan(now),
      },
      select: ['id_user'],
    });
  
    const userIds = [...new Set(expiredCodes.map(code => code.id_user))]; // uniques
  
    // 2. Mettre à jour les statuts
    const result = await this.qrCodeDynamiqueRepository.update(
      {
        statut: 'actif',
        date_expiration: LessThan(now),
      },
      {
        statut: 'inactif',
      },
    );
    
    // this.logger.log(`${result.affected} QR codes dynamiques expirés ont été désactivés`);
  }

  /**
   * Supprime les QR codes dynamiques expirés depuis plus de 1 jours
   */
  async removeOldQrCodes(): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 1); // Supprimer les QR codes expirés depuis plus de 7 jours
    
    const result = await this.qrCodeDynamiqueRepository.delete({
      date_expiration: LessThan(cutoffDate)
    });
    
    // this.logger.log(`${result.affected} QR codes dynamiques anciens ont été supprimés`);
  }

  /**
   * Permet de déclencher manuellement le nettoyage
   */
  async manualCleanup(): Promise<{ deleted: number }> {
    // Supprimer les codes très anciens (7 jours)
    const deletedCount = await this.qrCodeService.deleteOldExpiredQrCodes(7);
    
    return {
      deleted: deletedCount
    };
  }
}