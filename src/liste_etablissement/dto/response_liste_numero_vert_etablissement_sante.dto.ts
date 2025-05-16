export class ResponseListeNumeroVertEtablissementSanteDto {
  id_liste_num_etablissement_sante: number;
  id_admin_gestionnaire: number;
  nom_etablissement: string;
  contact: string;
  image?: string; // ✅ Ajoute le champ image ici
  presentation: string;
  adresse: string;
  latitude: number;
  longitude: number;
  type_etablissement: string;
  categorie: string;
  site_web?: string;
}
