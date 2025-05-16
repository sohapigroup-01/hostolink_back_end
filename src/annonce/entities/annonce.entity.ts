import { Administrateur } from 'src/administrateur/entities/administrateur.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('annonce')
export class Annonce {
  @PrimaryGeneratedColumn()
  id_annonce: number;

  @ManyToOne(() =>Administrateur, (admin) => admin.annonces, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_admin_gestionnaire' })  // 🔹 Correction ici
  id_admin_gestionnaire: Administrateur;

  @Column({ type: 'varchar', length: 255, nullable: true })
  titre_annonce: string;

  @Column({ type: 'text', nullable: true })
  description_annonce: string;

  @Column({ type: 'date', nullable: true })
  date: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  url_images: string;
}
