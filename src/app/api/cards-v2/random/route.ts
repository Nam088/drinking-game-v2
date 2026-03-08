import { NextResponse } from "next/server"
import { Container } from "@core/container"
import { CardService } from "@modules/cards/cards.service"
import { withErrorHandler } from "@/server/common/utils/error-handler"

export const POST = withErrorHandler(async (request: Request) => {
    const cardService = await Container.get(CardService)

    // Lấy excludeIds từ JSON body thay vì URL params
    let body: { excludeIds?: number[] } | null = null
    try {
        body = await request.json()
    } catch {
        // Nếu không có body thì cứ tiếp tục để query mặc định
    }
    
    const excludeIds: number[] = Array.isArray(body?.excludeIds) ? body.excludeIds : []

    const cardEntity = await cardService.getRandomCardV2(excludeIds)

    if (!cardEntity) {
        return NextResponse.json({ success: false, message: "No cards found in deck" }, { status: 404 })
    }

    // Map the actual data out of the entity json column
    const card = {
        id: cardEntity.id,
        ...cardEntity.data
    }

    return NextResponse.json({ success: true, card })
})
