import { 
    BaseEntity,
    Entity, 
    Column,
    PrimaryGeneratedColumn 
} from "typeorm";

@Entity("Coasters")
export class Coasters extends BaseEntity {
    
    @PrimaryGeneratedColumn("uuid")
    coasterId: string;

    @Column()
    userId: string;

    @Column()
    active: boolean;

    @Column()
    paused: boolean;

    @Column()
    name: string;
   
}