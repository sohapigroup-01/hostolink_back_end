import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn,
  } from 'typeorm';
import { MessageThematique } from './message_thematique.entity';
import { Administrateur } from 'src/administrateur/entities/administrateur.entity';
  
  @Entity('thematiques')
  export class Thematique {
    @PrimaryGeneratedColumn()
    id_thematique_discussion: number;
  
    @ManyToOne(() => Administrateur, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_admin_gestionnaire' })
    administrateur: Administrateur;
  
    @Column({ length: 255 })
    titre_thematique: string;
  
    @Column({ length: 255, nullable: true })
    sous_titre: string;
  
    @Column({ length: 255, nullable: true })
    image: string;
  
    @Column('text')
    description: string;
  
    @Column({ type: 'int', default: 0 })
    nbre_expert: number;
  
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    date_ajout: Date;
  
    @OneToMany(() => MessageThematique, (message) => message.thematique)
    messages: MessageThematique[];
  }
  