// // src/qr-code/entities/qr-code-dynamique.entity.ts
// import { User } from 'src/utilisateur/entities/user.entity';
// import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

// @Entity('qr_code_paiement_dynamique') // Assurez-vous que ce décorateur est présent
// export class QrCodeDynamique {
//   @PrimaryGeneratedColumn('increment')
//   id_qrcode: number;

//   @Column({ nullable: true })
//   id_user_etablissement_sante: number;
  
//   @Column({ nullable: true, type: 'uuid' })
//   id_user: string;

//   @Column({ length: 1000 })
//   token: string;

//   @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
//   date_creation: Date;

//   @Column({ type: 'timestamp' })
//   date_expiration: Date;

//   @Column({ length: 20, default: 'actif' })
//   statut: string;
  
//   // Relation avec l'utilisateur
//   @ManyToOne(() => User, { nullable: true })
//   @JoinColumn({ name: 'id_user' })
//   user: User;
  
//   /* 
//    * Relation avec l'établissement de santé (à décommenter plus tard)
//    */
//   /*
//   @ManyToOne(() => EtablissementSante, { nullable: true })
//   @JoinColumn({ name: 'id_user_etablissement_sante' })
//   etablissement: EtablissementSante;
//   */
// }



// src/qr-code/entitie/qr_code_dynamique.entity.ts
import { User } from 'src/utilisateur/entities/user.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('qr_code_paiement_dynamique')
export class QrCodeDynamique {
  @PrimaryGeneratedColumn('increment')
  id_qrcode: number;

  // Nouvel identifiant court pour les QR codes
  @Column({ length: 16, nullable: true })
  short_id: string;

  @Column({ nullable: true })
  id_user_etablissement_sante: number;
  
  @Column({ nullable: true, type: 'uuid' })
  id_user: string;

  @Column({ length: 1000 })
  token: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_creation: Date;

  @Column({ type: 'timestamp' })
  date_expiration: Date;

  @Column({ length: 20, default: 'actif' })
  statut: string;
  
  // Relation avec l'utilisateur
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'id_user' })
  user: User;
  
  /* 
   * Relation avec l'établissement de santé (à décommenter plus tard)
   */
  /*
  @ManyToOne(() => EtablissementSante, { nullable: true })
  @JoinColumn({ name: 'id_user_etablissement_sante' })
  etablissement: EtablissementSante;
  */
}