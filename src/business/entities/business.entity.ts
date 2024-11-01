import { UserEntity } from "src/users/entities/user.entity"; 
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinTable, ManyToMany } from "typeorm";

@Entity('business')
export class BusinessEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'varchar', length: 2000, nullable: true })
    description?: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    phone?: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    email?: string;

    @Column({ type: 'varchar', length: 50 })
    category: string; 

    @Column({ type: 'varchar', length: 100, nullable: true })
    street?: string;

    @Column({ type: 'varchar', length: 10, nullable: true })
    buildingNumber?: string;

    @Column({ type: 'varchar', length: 10, nullable: true })
    postalCode?: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    city?: string;

    @Column("json", { nullable: true }) 
    images?: string[];

    @ManyToOne(() => UserEntity, (user) => user.ownedBusinesses, { eager: true })
    owner: UserEntity; 

    @ManyToMany(() => UserEntity, (user) => user.businesses, { eager: true })
    @JoinTable()  
    workers?: UserEntity[];
}
