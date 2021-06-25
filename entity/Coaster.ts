import { 
    BaseEntity,
    Entity, 
    Column,
    PrimaryGeneratedColumn 
} from "typeorm";

@Entity()
export class Coaster extends BaseEntity {
    
    @PrimaryGeneratedColumn("uuid")
    coasterId: string;

    @Column()
    userId: string;

    @Column()
    active: boolean;

    @Column()
    paused: boolean;

    @Column()
    emailVerified: boolean;

    @Column()
    createdAt: string;
   
}