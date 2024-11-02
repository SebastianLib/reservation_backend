import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { BusinessEntity } from "src/business/entities/business.entity";
// import { ServiceEntity } from "src/services/entities/service.entity"; 

@Entity('categories')
export class CategoryEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    // Many-to-many relationship with businesses
    @ManyToMany(() => BusinessEntity, (business) => business.categories)
    businesses?: BusinessEntity[];

    // Many-to-many relationship with services
    // @ManyToMany(() => ServiceEntity, (service) => service.categories)
    // services?: ServiceEntity[];
}