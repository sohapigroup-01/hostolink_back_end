
import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as QRCode from 'qrcode';
import * as crypto from 'crypto';
import { QrCodeDynamique } from './entitie/qr_code_dynamique.entity';
import { QrCodeStatique } from './entitie/qr_code_statique.entity';
import { QrCodePayload, QrCodePayloadUser, QrCodeType, RecipientType } from './interface_qr_code/qr-code-payload.interface';
import { CompteService } from 'src/compte/compte.service';
import { UserService } from 'src/utilisateur/user.service';
import { CleanupService } from './cleanup.service';

@Injectable()
export class QrCodeService {
  constructor(
    @InjectRepository(QrCodeDynamique)
    private readonly qrCodeDynamiqueRepository: Repository<QrCodeDynamique>,
    
    @InjectRepository(QrCodeStatique)
    private readonly qrCodeStatiqueRepository: Repository<QrCodeStatique>,
    
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,

    @Inject(forwardRef(() => CompteService))
    private readonly compteService: CompteService,

    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    
    @Inject(forwardRef(() => CleanupService))
    private readonly cleanupService: CleanupService
  ) {}

  /**
   * Génère un identifiant court unique
   * @returns Identifiant court de 16 caractères
   */
  public generateShortId(): string {
    // Générer un ID court de 16 caractères hexadécimaux
    return crypto.randomBytes(8).toString('hex');
  }

  /**
   * Génère un token JWT pour un QR code avec un payload complet
   * @param payload Informations complètes pour le QR code
   */
  public generateTokenWithPayload(payload: QrCodePayload): string {
    const options: any = {
      secret: this.configService.get<string>('JWT_QR_SECRET', 'qr_code_secret_key'),
    };
    
    // Ajouter l'expiration seulement si c'est un QR code dynamique
    if (payload.qrType === QrCodeType.DYNAMIC && payload.expiresAt) {
      const expiresInSeconds = Math.floor((payload.expiresAt - payload.timestamp) / 1000);
      if (expiresInSeconds > 0) {
        options.expiresIn = `${expiresInSeconds}s`;
      }
    }
  
    return this.jwtService.sign(payload, options);
  }

  /**
   * Génère un payload pour un QR code utilisateur
   * @param isDynamic Si true, crée un payload pour QR code dynamique
   */
  public createUserPayload(
    id_user: string, 
    isDynamic: boolean, 
    expiresIn?: number,
    additionalInfo?: { 
      accountNumber?: string, 
      currency?: string
    }
  ): QrCodePayloadUser {
    const timestamp = Date.now();
    
    const payload: QrCodePayloadUser = {
      recipientType: RecipientType.USER,
      recipientId: id_user,
      qrType: isDynamic ? QrCodeType.DYNAMIC : QrCodeType.STATIC,
      timestamp,
      ...additionalInfo
    };
    
    // Ajouter l'expiration pour les QR codes dynamiques
    if (isDynamic && expiresIn) {
      payload.expiresAt = timestamp + (expiresIn * 1000);
    }
    
    return payload;
  }

  /**
   * Crée automatiquement un QR code statique pour un utilisateur lors de son inscription
   * @returns Le QR code statique créé
   */
  async createStaticQrForNewUser(
    id_user: string, 
    accountNumber?: string
  ): Promise<QrCodeStatique> {
    // Vérifier si un QR code statique existe déjà
    const existingQrCode = await this.qrCodeStatiqueRepository.findOne({
      where: { id_user }
    });
    
    if (existingQrCode) {
      return existingQrCode;
    }
    
    // Créer le payload et générer le token JWT
    const payload = this.createUserPayload(id_user, false, undefined, { accountNumber });
    const token = this.generateTokenWithPayload(payload);
    
    // Générer un identifiant court
    const shortId = this.generateShortId();
    
    // Créer l'entrée QR code statique
    const qrCode = this.qrCodeStatiqueRepository.create({
      id_user,
      token,
      short_id: shortId,
      statut: 'actif',
    });
    
    return this.qrCodeStatiqueRepository.save(qrCode);
  }

  /**
   * Récupère le QR code statique d'un utilisateur
   */
  async getUserStaticQrCode(id_user: string): Promise<QrCodeStatique | null> {
    return this.qrCodeStatiqueRepository.findOne({
      where: { id_user, statut: 'actif' }
    });
  }

  /**
   * Crée un QR code dynamique pour un utilisateur
   * @returns Le QR code dynamique créé
   */
  async createDynamicQrForUser(
    id_user: string, 
    accountNumber?: string,
    expiresIn: number = 60,
    currency?: string
  ): Promise<QrCodeDynamique> {
    // Créer le payload avec toutes les informations
    const payload = this.createUserPayload(
      id_user, 
      true, 
      expiresIn, 
      { accountNumber, currency }
    );
    
    // Générer le token JWT
    const token = this.generateTokenWithPayload(payload);
    
    // Générer un identifiant court
    const shortId = this.generateShortId();
    
    // Calculer la date d'expiration
    const dateExpiration = new Date(payload.expiresAt || Date.now() + (expiresIn * 1000));
    
    // Créer l'entrée QR code dynamique
    const qrCode = this.qrCodeDynamiqueRepository.create({
      id_user,
      token,
      short_id: shortId,
      date_expiration: dateExpiration,
      statut: 'actif',
    });
    
    // Sauvegarder le QR code
    const savedQrCode = await this.qrCodeDynamiqueRepository.save(qrCode);
    
    // Planifier la mise à jour automatique à l'expiration
    this.cleanupService.scheduleQrCodeUpdate(savedQrCode);
    
    return savedQrCode;
  }

  /**
   * Supprime les QR codes dynamiques expirés depuis longtemps
   */
  async deleteOldExpiredQrCodes(days: number = 7): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const result = await this.qrCodeDynamiqueRepository.delete({
      date_expiration: LessThan(cutoffDate)
    });
    
    // //console.log(`${result.affected} QR codes dynamiques anciens supprimés`);
    return result.affected || 0;
  }

  /**
   * Vérifie la validité d'un token JWT de QR code
   * @returns Payload décodé si valide
   */
  verifyToken(token: string): QrCodePayload {
    try {
      // Vérifier d'abord si c'est un token de QR code statique 
      const decoded = this.jwtService.decode(token) as QrCodePayload;
      
      // Configurer les options selon le type de QR code
      const options: any = {
        secret: this.configService.get<string>('JWT_QR_SECRET', 'qr_code_secret_key'),
      };
      
      if (decoded && decoded.qrType === QrCodeType.STATIC) {
        // Pour les QR codes statiques, ignorer l'expiration
        options.ignoreExpiration = true;
      } else {
        // Pour les QR codes dynamiques, vérifier l'expiration (comportement par défaut)
        options.ignoreExpiration = false;
      }
      
      return this.jwtService.verify(token, options);
    } catch (error) {
      throw new BadRequestException('Token invalide ou expiré');
    }
  }




  async refreshAllStaticQrCodes(): Promise<number> {
    // Récupérer tous les QR codes statiques actifs
    const staticQrCodes = await this.qrCodeStatiqueRepository.find({
      where: { statut: 'actif' }
    });
    
    let updatedCount = 0;
    
    for (const qrCode of staticQrCodes) {
      try {
        // Récupérer les informations du compte utilisateur si besoin
        const compte = await this.compteService.getUserCompte(qrCode.id_user);
        const accountNumber = compte ? compte.numero_compte : undefined;
        
        // Créer un nouveau payload sans expiration
        const payload = this.createUserPayload(
          qrCode.id_user, 
          false, // QR code statique
          undefined, // Pas d'expiration
          { accountNumber }
        );
        
        // Générer le nouveau token
        const token = this.generateTokenWithPayload(payload);
        
        // Mettre à jour le token
        qrCode.token = token;
        await this.qrCodeStatiqueRepository.save(qrCode);
        updatedCount++;
      } catch (error) {
        console.error(`Erreur lors du rafraîchissement du QR code statique ${qrCode.id_qrcode}: ${error.message}`);
        // Continuer avec le prochain QR code
      }
    }
    
    return updatedCount;
  }

 
  
  /**
   * Rafraîchit le token d'un QR code dynamique expiré
   * Cette fonction est utilisée uniquement en interne, jamais lors du scan
   */
  async refreshQrCodeToken(qrCode: QrCodeDynamique): Promise<void> {
    try {
      // Récupérer les informations du compte utilisateur
      const compte = await this.compteService.getUserCompte(qrCode.id_user);
      const accountNumber = compte ? compte.numero_compte : undefined;
      const currency = compte ? compte.devise : undefined;
      
      // Créer un nouveau payload et token
      const payload = this.createUserPayload(
        qrCode.id_user, 
        true, 
        60, // 1 minute
        { accountNumber, currency }
      );
      
      // Générer le nouveau token
      const token = this.generateTokenWithPayload(payload);
      
      // Mettre à jour l'entrée existante
      qrCode.token = token;
      qrCode.date_expiration = new Date(payload.expiresAt || Date.now() + (60 * 1000));
      
      // Sauvegarder les modifications
      await this.qrCodeDynamiqueRepository.save(qrCode);
      
      // Planifier la prochaine mise à jour automatique
      this.cleanupService.scheduleQrCodeUpdate(qrCode);
    } catch (error) {
      console.error(`Erreur lors du rafraîchissement du token: ${error.message}`);
      // Ne pas propager l'erreur pour éviter de bloquer le processus
    }
  }

 


  async validateQrCode(codeInput: string): Promise<any> {
    try {
      // //console.log(`Tentative de validation du code: ${codeInput}`);
      let qrCode: QrCodeDynamique | QrCodeStatique | null = null;
      let payload: QrCodePayload;
      
      // Essayer d'abord de trouver par identifiant court
      // //console.log(`Recherche du QR code par short_id: ${codeInput}`);
      
      // Chercher spécifiquement dans les QR codes statiques
      const staticQrCode = await this.qrCodeStatiqueRepository.findOne({
        where: { short_id: codeInput }
      });
      
      if (staticQrCode) {
        // //console.log(`QR code statique trouvé: ${JSON.stringify(staticQrCode)}`);
        
        if (staticQrCode.statut !== 'actif') {
          // //console.log(`QR code statique inactif: ${staticQrCode.statut}`);
          throw new BadRequestException('QR code inactif');
        }
        
        // //console.log(`Vérification du token du QR code statique`);
        try {
          payload = this.verifyToken(staticQrCode.token);
          // //console.log(`Token valide, payload: ${JSON.stringify(payload)}`);
          qrCode = staticQrCode;
        } catch (error) {
          // console.error(`Erreur lors de la vérification du token: ${error.message}`);
          throw new BadRequestException('Token invalide');
        }
      } else {
        // //console.log(`Aucun QR code statique trouvé, recherche dans les QR codes dynamiques`);
        // Chercher dans les QR codes dynamiques
        const dynamicQrCode = await this.qrCodeDynamiqueRepository.findOne({
          where: { short_id: codeInput }
        });
        
        if (dynamicQrCode) {
          // //console.log(`QR code dynamique trouvé: ${JSON.stringify(dynamicQrCode)}`);
          
          if (dynamicQrCode.statut !== 'actif') {
            // //console.log(`QR code dynamique inactif: ${dynamicQrCode.statut}`);
            throw new BadRequestException('QR code inactif');
          }
          
          // Vérifier l'expiration pour les QR codes dynamiques
          const now = new Date();
          if (now > dynamicQrCode.date_expiration) {
            // //console.log(`QR code dynamique expiré: ${dynamicQrCode.date_expiration}`);
            throw new BadRequestException('QR code expiré');
          }
          
          try {
            payload = this.verifyToken(dynamicQrCode.token);
            // //console.log(`Token dynamique valide, payload: ${JSON.stringify(payload)}`);
            qrCode = dynamicQrCode;
          } catch (error) {
            // console.error(`Erreur lors de la vérification du token dynamique: ${error.message}`);
            throw new BadRequestException('le Token est invalide');
          }
        } else {
          // //console.log(`Aucun QR code trouvé par short_id, tentative de validation directe du token`);
          // Essayer de vérifier comme token JWT
          try {
            payload = this.verifyToken(codeInput);
            // //console.log(`Token direct valide, payload: ${JSON.stringify(payload)}`);
            
            // Chercher le QR code correspondant au token
            const isDynamic = payload.qrType === QrCodeType.DYNAMIC;
            
            if (isDynamic) {
              qrCode = await this.qrCodeDynamiqueRepository.findOne({
                where: { token: codeInput }
              });
              // //console.log(`QR code dynamique trouvé par token: ${qrCode ? 'oui' : 'non'}`);
            } else {
              qrCode = await this.qrCodeStatiqueRepository.findOne({
                where: { token: codeInput }
              });
              // //console.log(`QR code statique trouvé par token: ${qrCode ? 'oui' : 'non'}`);
            }
            
            if (!qrCode) {
              throw new NotFoundException('QR code non trouvé avec ce token');
            }
            
            if (qrCode.statut !== 'actif') {
              // //console.log(`QR code trouvé mais inactif: ${qrCode.statut}`);
              throw new BadRequestException('QR code inactif');
            }
          } catch (error) {
            // console.error(`Erreur lors de la validation directe du token: ${error.message}`);
            throw new BadRequestException('token expiré');
          }
        }
      }
      
      // Récupérer les informations utilisateur
      // //console.log(`Récupération des informations utilisateur pour le payload`);
      const id_user = payload.recipientType === RecipientType.USER ? payload.recipientId as string : undefined;
      let userInfo: { identifiant: string; nom: string; prenom: string; numero_compte: string } | null = null;
  
      if (id_user) {
        const user = await this.userService.getUserById(id_user);
        const compte = await this.compteService.getUserCompte(id_user);
  
        if (user && compte) {
          userInfo = {
            identifiant: user.id_user,
            nom: user.nom,
            prenom: user.prenom,
            numero_compte: compte.numero_compte
          };
          // //console.log(`Informations utilisateur récupérées: ${JSON.stringify(userInfo)}`);
        } else {
          // //console.log(`Utilisateur ou compte non trouvé: user=${!!user}, compte=${!!compte}`);
        }
      }
  
      // Retourner les informations complètes
      const result = {
        ...payload,
        id_qrcode: qrCode.id_qrcode,
        short_id: qrCode.short_id,
        creation_date: qrCode.date_creation,
        utilisateur: userInfo
      };
      
      // //console.log(`Validation réussie, retour des données`);
      return result;
    } catch (error) {
      console.error(`Erreur finale dans validateQrCode: ${error.message}`);
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Erreur de validation du QR code: ' + error.message);
    }
  }




  /**
   * Génère une représentation image d'un QR code à partir d'un identifiant court ou d'un token
   */
  async generateQrCodeImage(idOrToken: string): Promise<string> {
    try {
      return await QRCode.toDataURL(idOrToken);
    } catch (error) {
      throw new BadRequestException('Erreur lors de la génération de l\'image QR code');
    }
  }

  /**
   * Rafraîchit ou réutilise un QR code dynamique pour un utilisateur
   * En mettant à jour le token plutôt qu'en créant une nouvelle entrée
   */
  async refreshUserDynamicQrCode(
    id_user: string, 
    accountNumber?: string,
    expiresIn: number = 60,
    currency?: string
  ): Promise<QrCodeDynamique> {
    try {
      // Chercher d'abord un QR code dynamique existant pour cet utilisateur
      const existingQrCode = await this.qrCodeDynamiqueRepository.findOne({
        where: { id_user, statut: 'actif' },
        order: { date_creation: 'DESC' }
      });
      
      // Si un QR code existe, le mettre à jour
      if (existingQrCode) {
        // Créer un nouveau payload et token
        const payload = this.createUserPayload(
          id_user, 
          true, 
          expiresIn, 
          { accountNumber, currency }
        );
        const token = this.generateTokenWithPayload(payload);
        
        // Mettre à jour le QR code existant
        existingQrCode.token = token;
        existingQrCode.date_expiration = new Date(payload.expiresAt || Date.now() + (expiresIn * 1000));
        
        // Sauvegarder les modifications
        const updatedQrCode = await this.qrCodeDynamiqueRepository.save(existingQrCode);
        
        // Planifier la mise à jour automatique à l'expiration
        this.cleanupService.scheduleQrCodeUpdate(updatedQrCode);
        
        return updatedQrCode;
      }
      
      // Si aucun QR code n'existe, en créer un nouveau
      return this.createDynamicQrForUser(id_user, accountNumber, expiresIn, currency);
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du QR code:', error);
      throw new BadRequestException('Impossible de rafraîchir le QR code: ' + error.message);
    }
  }

  /**
   * Récupère ou crée un QR code dynamique pour un utilisateur
   * Met à jour automatiquement le token si expiré
   */
  async getUserDynamicQrCodes(id_user: string): Promise<QrCodeDynamique[]> {
    // Récupérer le QR code dynamique actif le plus récent de l'utilisateur
    let userQRCode = await this.qrCodeDynamiqueRepository.findOne({
      where: { id_user, statut: 'actif' },
      order: { date_creation: 'DESC' }
    });
    
    // Si aucun QR code n'existe, en créer un nouveau
    if (!userQRCode) {
      const compte = await this.compteService.getUserCompte(id_user);
      userQRCode = await this.createDynamicQrForUser(
        id_user, 
        compte?.numero_compte, 
        60, 
        compte?.devise
      );
      return [userQRCode];
    }
    
    // Vérifier si le QR code est expiré et le rafraîchir si besoin
    // (uniquement quand c'est l'utilisateur propriétaire qui le demande)
    const now = new Date();
    if (now > userQRCode.date_expiration) {
      await this.refreshQrCodeToken(userQRCode);
    }
    
    return [userQRCode];
  }

  /**
   * Récupère tous les QR codes (statiques et dynamiques) d'un utilisateur spécifique
   * @returns Objet contenant les QR codes statiques et dynamiques
   */
  async getAllUserQrCodes(id_user: string): Promise<{ static: QrCodeStatique[], dynamic: QrCodeDynamique[] }> {
    const staticQrCodes = await this.qrCodeStatiqueRepository.find({
      where: { 
        id_user,
        statut: 'actif'
      }
    });
    
    // Pour les QR codes dynamiques, utiliser la méthode qui gère l'expiration
    const dynamicQrCodes = await this.getUserDynamicQrCodes(id_user);
    
    return {
      static: staticQrCodes,
      dynamic: dynamicQrCodes
    };
  }

  /**
   * Récupère un QR code spécifique (statique ou dynamique) par son ID
   * Le rafraîchissement automatique est permis uniquement dans ce cas
   * car il s'agit d'une méthode utilisée par l'utilisateur propriétaire
   */
  async getQrCodeById(id_qrcode: number, type: 'static' | 'dynamic'): Promise<QrCodeStatique | QrCodeDynamique | null> {
    if (type === 'static') {
      return this.qrCodeStatiqueRepository.findOne({
        where: { id_qrcode }
      });
    } else {
      // Si c'est un QR code dynamique, vérifier s'il est expiré
      const qrCode = await this.qrCodeDynamiqueRepository.findOne({
        where: { id_qrcode }
      });
      
      if (qrCode && qrCode.statut === 'actif') {
        const now = new Date();
        if (now > qrCode.date_expiration) {
          // Mettre à jour le token au lieu de désactiver
          await this.refreshQrCodeToken(qrCode);
        }
      }
      
      return qrCode;
    }
  }
}