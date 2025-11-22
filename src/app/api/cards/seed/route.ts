import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { CardService } from "@/server/modules/cards/cards.service"
import { Container } from "@/server/core/container"

export async function POST() {
    try {
        const cardService = await Container.get(CardService)

        // Read data.json
        const jsonPath = path.join(process.cwd(), "data.json")
        const jsonContent = await fs.readFile(jsonPath, "utf-8")
        const cards = JSON.parse(jsonContent)

        // Clear existing cards
        await cardService.clearAll()

        // Insert all cards
        let insertedCount = 0
        for (const card of cards) {
            await cardService.create({
                id: card.id,
                category: card.category,
                content: card.content,
                penalty: card.penalty,
                difficulty: card.difficulty
            })
            insertedCount++
        }

        return NextResponse.json({
            success: true,
            message: `Successfully seeded ${insertedCount} cards from data.json`,
            count: insertedCount
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
