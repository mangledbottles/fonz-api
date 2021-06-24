import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity()
export class User extends BaseEntity {
    
    @PrimaryGeneratedColumn("uuid")
    userId: string;

    @Column()
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
    
}