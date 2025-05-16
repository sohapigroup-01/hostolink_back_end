// src/compte/dto/create-compte.dto.ts
/**
 * DTOs pour les comptes des utilisateurs et établissements de santé
 */

// DTO pour créer un compte (utilisé en interne)
export class CreateCompteDto {
  solde_compte?: number;
  solde_bonus?: number;
  cumule_mensuel?: number;
  plafond?: number;
  mode_paiement_preferentiel?: string;
  type_user: string;
  devise?: string;
  id_user?: string;
  id_user_etablissement_sante?: number;
}

// DTO pour la mise à jour du mode de paiement préférentiel
export class UpdateModePaiementDto {
  mode_paiement_preferentiel: string;
}