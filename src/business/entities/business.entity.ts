import { CategoryEntity } from "src/categories/entities/category.entity";
import { UserEntity } from "src/users/entities/user.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinTable, ManyToMany, OneToMany } from "typeorm";
import { InviteCodeEntity } from "./invite-code.entity";

type OpenHour = {
  isOpen: boolean;
  open: string;
  close: string;
};

interface OpenHours {
  monday: OpenHour;
  tuesday: OpenHour;
  wednesday: OpenHour;
  thursday: OpenHour;
  friday: OpenHour;
  saturday: OpenHour;
  sunday: OpenHour;
}

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

  @ManyToMany(() => CategoryEntity, (category) => category.businesses, {
    eager: true,
    onDelete: "CASCADE",
  })
  @JoinTable()
  categories?: CategoryEntity[];

  @ManyToOne(() => UserEntity, (user) => user.ownedBusinesses, { eager: true })
  owner: UserEntity;

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

  @Column("json", { nullable: true })
  openHours?: OpenHours;

  @ManyToOne(() => BusinessEntity, (business) => business.inviteCodes, { onDelete: 'CASCADE' })
  inviteCodes: InviteCodeEntity[];

  @ManyToMany(() => UserEntity, (user) => user.businesses, {
    eager: true,
    onDelete: "CASCADE",
  })
  workers?: UserEntity[];
}