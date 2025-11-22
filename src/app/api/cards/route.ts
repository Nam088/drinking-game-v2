import { NextResponse } from "next/server"
import { Container } from "@core/container"
import { CardService } from "@modules/cards/cards.service"
import { withErrorHandler } from "@/server/common/utils/error-handler"

export const GET = withErrorHandler(async () => {
    const cardService = await Container.get(CardService)
    const cards = await cardService.getAllCards()
    return NextResponse.json({ success: true, count: cards.length, cards })
})
