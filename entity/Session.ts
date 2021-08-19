import { 
    BaseEntity,
    Entity, 
    Column,
    PrimaryGeneratedColumn, 
    ManyToOne,
    JoinColumn
} from "typeorm";

/** Import required entities */
import { Users } from "./Users";

@Entity("Sessions")
export class Session extends BaseEntity {
    
    @PrimaryGeneratedColumn("uuid")
    sessionId: string;

    @Column()
    userId: string;

    @ManyToOne(type => Users, user => user.userId)
    @JoinColumn({ name: "userId" })
    public user!: Users

    @Column({ default: true })
    active: Boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: string;

    @Column()
    provider: string;
}