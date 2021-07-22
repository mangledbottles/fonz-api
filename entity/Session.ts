import { 
    BaseEntity,
    Entity, 
    Column,
    PrimaryGeneratedColumn 
} from "typeorm";

@Entity("Sessions")
export class Session extends BaseEntity {
    
    @PrimaryGeneratedColumn("uuid")
    sessionId: string;

    @Column()
    userId: string;

    @Column()
    active: Boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: string;

    @Column()
    provider: string;
}