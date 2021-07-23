import { 
    BaseEntity,
    Entity, 
    Column,
    PrimaryGeneratedColumn, 
    JoinColumn,
    ManyToOne,
    PrimaryColumn
} from "typeorm";

import { Session } from "./Session";
import { Users } from "./Users";

@Entity("MusicProviders")
export class MusicProviders extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    providerId: string;

    @PrimaryColumn()
    userId: string;

    @ManyToOne(type => Users, user => user.userId)
    @JoinColumn({ name: "userId" })
    public user!: Users

    // @OneToMany(type => Users) @JoinColumn() 
    // userId: string;

    @Column()
    country: string;

    @Column()
    displayName: string;

    @Column()
    expiresIn: number;

    @Column()
    refreshToken: string;

    @Column()
    additional: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    lastUpdated: string;
    
    @Column({ default: 'Spotify' })
    provider: string;

    @Column({ nullable: true, default: null })
    sessionId: string;

    @ManyToOne(type => Session, session => session.sessionId)
    @JoinColumn({ name: "sessionId" })
    public session!: Session
}