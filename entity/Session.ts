import { 
    BaseEntity,
    Entity, 
    Column,
    PrimaryGeneratedColumn 
} from "typeorm";

@Entity()
export class Session extends BaseEntity {
    
    @PrimaryGeneratedColumn("uuid")
    sessionId: string;

    @Column()
    userId: string;

    @Column()
    status: Boolean;

    @Column()
    createdAt: Date;

    @Column()
    provider: string;
}