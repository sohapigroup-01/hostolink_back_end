import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { Point } from 'geojson';

@Entity('user_etablissement_sante')
export class EtablissementSante {
  @PrimaryGeneratedColumn({ name: 'id_user_etablissement_sante' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  nom: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telephone: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  categorie: string;

  @Column({ type: 'text' })
  adresse: string;

  @CreateDateColumn({ name: 'creat_at' })
  createdAt: Date;

  @Column({ type: 'double precision' })
  latitude: number;

  @Column({ type: 'double precision' })
  longitude: number;

  @Column({ type: 'geometry', spatialFeatureType: 'Point', srid: 4326 })
  geom: Point;
}
