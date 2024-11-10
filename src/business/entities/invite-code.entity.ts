import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { BusinessEntity } from './business.entity';

@Entity('invite_codes')
export class InviteCodeEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 50 })
    inviteCode: string;

    @Column({ type: 'timestamp' })
    expirationTime: Date;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @ManyToOne(() => BusinessEntity, business => business.inviteCodes)
    business: BusinessEntity;
}