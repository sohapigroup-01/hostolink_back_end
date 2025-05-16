import { User } from 'src/utilisateur/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';


@Entity('invitation')
export class Invitation {
  @PrimaryGeneratedColumn()
  id_invitation: number;

  @Column({ type: 'uuid' })
  id_user: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  code_invitation: string;

  @Column({ type: 'int', default: 0 })
  nombre_partages: number;

  @Column({ type: 'int', default: 0 })
  nombre_clicks: number;

  @Column({ type: 'int', default: 0 })
  nombre_inscriptions: number;

  @CreateDateColumn({ type: 'timestamp' })
  date_creation: Date;

  @ManyToOne(() => User, user => user.invitations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_user' })
  user: User;
} 

