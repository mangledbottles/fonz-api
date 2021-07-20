import { 
    BaseEntity,
    Entity, 
    Column,
    PrimaryGeneratedColumn 
} from "typeorm";

@Entity("Providers")
export class Provider extends BaseEntity {
    
    @PrimaryGeneratedColumn("uuid")
    userId: string;

    @Column({ default: "Spotify" })
    provider: string;

    @Column()
    rawId: number;

    @Column()
    email: string;

    @Column()
    displayName: string;
}