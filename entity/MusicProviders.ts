import { 
    BaseEntity,
    Entity, 
    Column,
    PrimaryGeneratedColumn, 
    OneToOne,
    JoinColumn
} from "typeorm";

import { Users } from "./Users";

@Entity("MusicProviders")
export class MusicProviders extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    providerId: string;

    @OneToOne(type => Users) @JoinColumn() 
    userId: string;

    @Column()
    country: string;

    @Column()
    displayName: string;

    @Column()
    expiresIn: Date;

    @Column()
    refreshToken: string;

    @Column()
    additional: string;

    @Column()
    createdAt: Date;

    @Column()
    lastUpdated: Date;
    
    @Column()
    provider: string;
}