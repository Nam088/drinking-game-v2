import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Card {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    category!: string

    @Column()
    content!: string

    @Column()
    penalty!: string

    @Column()
    difficulty!: string
}
