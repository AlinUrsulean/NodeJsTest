
import { Entity, PrimaryGeneratedColumn, Column, Unique } from "typeorm"

@Entity()
export class User {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    name: string

    @Column()
    email: string   

    @Column()
    token: string

    @Column()
    passwordHash:string

}
