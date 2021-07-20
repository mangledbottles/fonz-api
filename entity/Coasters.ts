import { 
    BaseEntity,
    Entity, 
    Column,
    PrimaryColumn,
    ManyToOne,
    JoinColumn
} from "typeorm";

import { Users } from "./Users";

@Entity("Coasters")
export class Coasters extends BaseEntity {
    
    // Coasters have their own unique ID set in the NFC tag eg 0400BB1AE66C81 
    @PrimaryColumn({ unique: true, length: 32})
    coasterId: string;

    @Column({ nullable: true,})
    userId: string | null;

    @ManyToOne(type => Users, user => user.userId)
    @JoinColumn({ name: "userId" })
    public user!: Users

    @Column()
    active: boolean;

    @Column({ length: 64 })
    name: string;
   
}