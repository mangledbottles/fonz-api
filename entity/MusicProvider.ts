import { 
    BaseEntity,
    Entity, 
    Column,
    PrimaryGeneratedColumn 
} from "typeorm";

@Entity()
export class MusicProvider extends BaseEntity {
    
    @PrimaryGeneratedColumn("uuid")
    providerId: string;

    @Column()
    userId: string;

    @Column()
    provider: string;

    @Column()
    country: string;

    @Column()
    displayName: string;

    @Column()
    expiresIn: Date;

    @Column()
    refreshToken: string;

    @Column()
    additional: boolean;

    @Column()
    createdAt: Date;

    @Column()
    lastUpdated: Date;
    
}