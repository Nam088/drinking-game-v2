import { NextResponse } from "next/server"
import { Container } from "@core/container"
import { CardService } from "@modules/cards/cards.service"
import { withErrorHandler } from "@/server/common/utils/error-handler"

export const GET = withErrorHandler(async () => {
    const cardService = await Container.get(CardService)
    const card = await cardService.getRandomCard()

    if (!card) {
        return NextResponse.json({ success: false, message: "No cards found in deck" }, { status: 404 })
    }

    return NextResponse.json({ success: true, card })
})
