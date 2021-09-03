import { 
    BaseEntity,
    Entity, 
    Column,
    PrimaryColumn,
} from "typeorm";

/** Import required entities */
// import { Users } from "./Users";

@Entity("Coasters")
export class Coasters extends BaseEntity {
    
    // Coasters have their own unique ID set in the NFC tag eg 0400BB1AE66C81 
    @PrimaryColumn({ unique: true, length: 32})
    coasterId: string;

    @Column({ nullable: true,})
    userId: string | null;

    @Column()
    active: boolean;

    @Column({ default: false })
    encoded: boolean;

    @Column({ nullable: true })
    group: string | null;

    @Column({ length: 64 })
    name: string;
   
}