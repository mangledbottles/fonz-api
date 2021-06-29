import { 
    Entity, 
    Column,
    // PrimaryColumn,
    PrimaryGeneratedColumn 
} from "typeorm";

@Entity("Users")
export class Users {

    // (userId, email, password, passwordSalt, emailVerified, 
    // createdAt, lastSignedInAt, agreedConsent,
    // agreedMarketing, displayName, providerSignIn) 
    
    @PrimaryGeneratedColumn("uuid")
    // @PrimaryColumn()
    userId: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    passwordSalt: string;

    @Column()
    emailVerified: boolean;

    @Column()
    createdAt: Date;

    @Column()
    lastSignedInAt: Date;

    @Column()
    agreedConsent: boolean;

    @Column()
    agreedMarketing: boolean;

    @Column()
    displayName: string;

    @Column()
    providerSignIn: boolean;
    
    @Column()
    firebase: string;
    

}