import { BusinessEntity } from "src/business/entities/business.entity";
import { ROLES } from "src/utility/common/user-roles.enum";
import { USER_STATUS } from "src/utility/common/user-status.enum";
import { Column, CreateDateColumn, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn, Timestamp } from "typeorm";

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username!: string;

    @Column()
    surname!: string;

    @Column()
    phone!: string;

    @Column({ nullable: true })
    email?: string | null;

    @Column()
    prefix!: string;

    @Column({select:false})
    password!: string;

    @Column({type: "enum", enum:ROLES, array:true, default:ROLES.CUSTOMER})
    role!: ROLES

    @Column({ nullable: true })
    image?: string | null;

    @Column({ type: 'enum', enum: USER_STATUS, default: USER_STATUS.WAITING_FOR_VERIFICATION })
    status!: USER_STATUS;

    @Column({ type: 'varchar', nullable: true, length: 6 })
    verificationCode?: string | null;

    @CreateDateColumn()
    createdAt!: Timestamp;

    @CreateDateColumn()
    updatedAt!: Timestamp;

    @OneToMany(() => BusinessEntity, (business) => business.owner)
    ownedBusinesses: BusinessEntity[];

    @ManyToMany(() => BusinessEntity, (business) => business.workers)
    businesses: BusinessEntity[]; 
}
