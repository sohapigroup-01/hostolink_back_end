// // src/qr-code/interfaces/qr-code-payload.interface.ts
// export enum QrCodeType {
//   STATIC = 'static',
//   DYNAMIC = 'dynamic'
// }

// export enum RecipientType {
//   USER = 'utilisateur',
//   ETABLISSEMENT = 'etablissement'
// }

// export interface QrCodePayload {
//   recipientType: RecipientType;
//   recipientId: string | number; // string pour UUID (user), number pour integer (établissement)
//   accountNumber?: string;
//   currency?: string;
//   qrType: QrCodeType;
//   timestamp: number;
//   expiresAt?: number; // Uniquement pour les QR codes dynamiques
// }
// src/qr-code/types/qr-code.types.ts








/**
 * Types de destinataires pour les QR codes
 */
export enum RecipientType {
  USER = 'user',
  ETABLISSEMENT = 'etablissement'
}

/**
 * Types de QR codes
 */
export enum QrCodeType {
  STATIC = 'static',
  DYNAMIC = 'dynamic'
}

/**
 * Interface pour les payloads de QR codes destinés aux utilisateurs
 */
export interface QrCodePayloadUser {
  recipientType: RecipientType.USER;
  recipientId: string; // UUID obligatoire pour user
  accountNumber?: string;
  currency?: string;
  qrType: QrCodeType;
  timestamp: number;
  expiresAt?: number;
  // amount?: number;
  // description?: string;
}

/**
 * Interface pour les payloads de QR codes destinés aux établissements
 */
export interface QrCodePayloadEtablissement {
  recipientType: RecipientType.ETABLISSEMENT;
  recipientId: number; // ID numérique pour établissement
  accountNumber?: string;
  currency?: string;
  qrType: QrCodeType;
  timestamp: number;
  expiresAt?: number;
//   amount?: number;
//   description?: string;
}

/**
 * Type union pour représenter les deux types de payloads
 */
export type QrCodePayload = QrCodePayloadUser | QrCodePayloadEtablissement;