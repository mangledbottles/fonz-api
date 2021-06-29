import { 
    BaseEntity,
    Entity, 
    Column,
    PrimaryGeneratedColumn, 
    JoinColumn,
    ManyToOne,
    PrimaryColumn
} from "typeorm";

import { Users } from "./Users";

@Entity("musicProviders")
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
}