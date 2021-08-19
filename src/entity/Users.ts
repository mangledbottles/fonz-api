import { 
    Entity, 
    Column,
    // PrimaryColumn,
    PrimaryGeneratedColumn 
} from "typeorm";

@Entity("Users")
export class Users {
    
    @PrimaryGeneratedColumn("uuid")
    // @PrimaryColumn()
    userId: string;

    @Column({ unique: true, nullable: true })
    email: string;

    @Column({ length: 256, nullable: true })
    password: string;

    @Column()
    passwordSalt: string;

    @Column()
    refreshToken: string;

    @Column()
    emailVerified: boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    lastSignedInAt: string;

    @Column()
    agreedConsent: boolean;

    @Column()
    agreedMarketing: boolean;

    @Column()
    displayName: string;

    @Column()
    providerSignIn: boolean;
    
}