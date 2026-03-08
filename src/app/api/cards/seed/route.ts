import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { CardService } from "@/server/modules/cards/cards.service"
import { Container } from "@/server/core/container"

export async function POST() {
    try {
        const cardService = await Container.get(CardService)

        // Read data.json (V1)
        const jsonPath1 = path.join(process.cwd(), "data.json")
        const jsonContent1 = await fs.readFile(jsonPath1, "utf-8")
        const cardsV1 = JSON.parse(jsonContent1)

        // Clear existing cards V1
        await cardService.clearAll()

        // Insert all cards V1
        let insertedCountV1 = 0
        for (const card of cardsV1) {
            await cardService.create({
                id: card.id,
                category: card.category,
                content: card.content,
                penalty: card.penalty,
                difficulty: card.difficulty
            })
            insertedCountV1++
        }

        // Read datav2.json (V2)
        const jsonPath2 = path.join(process.cwd(), "datav2.json")
        const jsonContent2 = await fs.readFile(jsonPath2, "utf-8")
        const cardsV2 = JSON.parse(jsonContent2)

        // Clear existing cards V2
        await cardService.clearAllV2()

        // Insert all cards V2
        let insertedCountV2 = 0
        for (const card of cardsV2) {
            await cardService.createV2({
                id: card.id,
                title: card.title,
                data: card // Toàn bộ object sẽ nhét vô field data JSON của TypeORM
            })
            insertedCountV2++
        }

        return NextResponse.json({
            success: true,
            message: `Successfully seeded ${insertedCountV1} cards (V1) and ${insertedCountV2} cards (V2).`,
            countV1: insertedCountV1,
            countV2: insertedCountV2
        })
    } catch (error) {
        console.error("Seed error:", error)
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        )
    }
}
