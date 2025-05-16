
import { Administrateur } from 'src/administrateur/entities/administrateur.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';



@Entity('liste_numero_vert_etablissement_sante')
export class ListeNumeroEtablissementSante {
  
  @PrimaryGeneratedColumn()
  id_liste_num_etablissement_sante: number;

  @ManyToOne(() => Administrateur, (admin) => admin.liste_numero_vert, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_admin_gestionnaire' })
  administrateur: Administrateur;

  @Column({ type: 'varchar', length: 255, nullable: false })
  nom_etablissement: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  contact: string;

  @Column({ type: 'varchar', length: 255, nullable: true }) // ✅ Nullable car pas obligatoire
  image: string;

  @Column({ type: 'text', nullable: false })
  presentation: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  adresse: string;

  @Column({ type: 'double precision', nullable: false })
  latitude: number;

  @Column({ type: 'double precision', nullable: false })
  longitude: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  type_etablissement: string;

  @Column({ type: 'varchar', length: 255, nullable: true }) // ✅ Nullable pour les établissements sans site web
  site_web?: string;

  @Column({ type: 'varchar', length: 50, nullable: false, default: 'Autre' }) // ✅ Défaut "Autre"
  categorie: string;
}
