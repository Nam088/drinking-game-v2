import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

// ------------------------------------------------------------------------
// ENTITY CARD V2 (TOÀN BỘ DATA LƯU TRONG 1 FIELD CHO SQLITE)
// ------------------------------------------------------------------------

@Entity('card_v2')
export class CardV2 {
    
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 255 })
    title!: string;

    // Toàn bộ cục Object JSON của thẻ bài mà AI sinh ra sẽ được ném vào đây 
    @Column({ type: "simple-json" })
    data!: Record<string, unknown>;

    @Column({ type: "boolean", default: true })
    isActive!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
