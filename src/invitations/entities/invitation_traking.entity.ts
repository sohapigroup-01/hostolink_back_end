
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Invitation } from './invitation.entity';

@Entity('invitation_tracking')
export class InvitationTracking {
  @PrimaryGeneratedColumn()
  id_tracking: number;

  @Column({ type: 'varchar', length: 100 })
  code_invitation: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  ip_visiteur: string;

  @Column({ type: 'text', nullable: true })
  user_agent: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_click: Date;

  @ManyToOne(() => Invitation, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'code_invitation', referencedColumnName: 'code_invitation' })
  invitation: Invitation;
}
