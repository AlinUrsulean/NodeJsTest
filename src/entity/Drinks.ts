
import { Entity, PrimaryGeneratedColumn, Column, Unique, OneToOne, JoinColumn } from "typeorm"

import {User} from "./User"
@Entity()
export class Drinks {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    name: string

    @Column()
    numberOfIngredients: number   

    @Column()
    isAlcoholic: boolean

    @Column()
    typeOfGlass: string

    @Column()
    @OneToOne(type=>User)@JoinColumn() 
    added_by:string

}
