
// import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
// import { Publication } from 'src/publication/entities/publication.entity';
// import { User } from 'src/utilisateur/entities/user.entity';

// @Entity()
// export class Commentaire {
//   @PrimaryGeneratedColumn()
//   id_commentaire: number;

//   @Column({ type: 'text' })  //j'ai mis le type ici car dans la BD le type de "contenu" est 'text';
//   contenu: string;

//   @CreateDateColumn()
//   date_commentaire: Date;

//   @ManyToOne(() => Publication, publication => publication.commentaires, {
//     nullable: false,
//     onDelete: 'CASCADE' 
//   })
//   @JoinColumn({ name: 'id_publication' })
//   publication: Publication;

//   @ManyToOne(() => User, user => user.commentaires, {
//     nullable: false
//   })
//   @JoinColumn({ name: 'id_user' })
//   user: User;
// }