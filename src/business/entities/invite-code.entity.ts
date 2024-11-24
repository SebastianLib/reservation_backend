import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { BusinessEntity } from './business.entity';

@Entity('invite_codes')
export class InviteCodeEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 50 })
    inviteCode: string;
    
    @Column({ type: 'timestamp', nullable: true })
    expirationTime?: Date;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @ManyToOne(() => BusinessEntity, business => business.inviteCodes, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'businessId' })
    business: BusinessEntity;
}