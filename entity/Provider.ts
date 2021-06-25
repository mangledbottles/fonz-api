import { 
    BaseEntity,
    Entity, 
    Column,
    PrimaryGeneratedColumn 
} from "typeorm";

@Entity()
export class Provider extends BaseEntity {
    
    @PrimaryGeneratedColumn("uuid")
    userId: string;

    @Column()
    provider: string;

    @Column()
    rawId: number;

    @Column()
    email: string;

    @Column()
    displayName: string;
}