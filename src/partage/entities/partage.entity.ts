// // src/partage/entities/partage.entity.ts
// import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, OneToOne } from 'typeorm';
// import { User } from 'src/utilisateur/entities/user.entity';
// import { Publication } from 'src/publication/entities/publication.entity';

// @Entity()
// export class Partage {
//   @PrimaryGeneratedColumn()
//   id_partage: number;

//   @ManyToOne(() => User, { nullable: false })
//   @JoinColumn({ name: 'id_user' })
//   user: User;

//   @ManyToOne(() => Publication, { nullable: false })
//   @JoinColumn({ name: 'id_publication' })
//   publication: Publication;

//   @Column()
//   lien_partage: string;

//   @CreateDateColumn()
//   date_partage: Date;

//   @Column({ nullable: true })
//   plateforme_partage: string; // WhatsApp, Facebook, Email, etc.

//   @Column({ default: 0 })
//   nombre_clics: number; // Pour suivre combien de fois le lien a été cliqué

// }