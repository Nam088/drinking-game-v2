import { Repository, DeepPartial } from "typeorm"
import { InjectRepository } from "@common/decorators/inject-repository.decorator"
import { Service } from "@common/decorators/service.decorator"
import { createLogger } from "@common/utils/logger"
import { Card } from "./card.entity"
import fs from "fs"
import path from "path"

const logger = createLogger("CardService")

@Service()
export class CardService {
    constructor(
        @InjectRepository(Card)
        private cardRepository: Repository<Card>
    ) { }

    async seed(): Promise<void> {
        logger.info("Seeding cards...")
        const csvPath = path.join(process.cwd(), "data.csv")
        const jsonPath = path.join(process.cwd(), "data.json")

        let cards: DeepPartial<Card>[] = []

        if (fs.existsSync(csvPath)) {
            logger.info("Found data.csv, parsing...")
            const fileContent = fs.readFileSync(csvPath, "utf-8")
            const { parse } = await import("csv-parse/sync")

            const records: Record<string, string>[] = parse(fileContent, {
                columns: true,
                skip_empty_lines: true,
                trim: true,
                quote: '\0', // Disable quoting by setting quote char to null/non-existent
                relax_column_count: true
            })

            cards = records
                .filter((record) => record.Category !== 'Category') // Filter out repeated headers
                .map((record) => ({
                    category: record.Category as "DARE" | "TRUTH" | "GROUP_TRUTH" | "PARTNER" | "MINI_GAME" | "VOTE" | "BRAIN" | "SKILL" | "CURSE" | "BUDDY" | "ITEM" | "SECRET" | "ITEM_KEEP",
                    content: record.Content,
                    penalty: record.Penalty,
                    difficulty: record.Difficulty as "EASY" | "MEDIUM" | "HARD" | "FUN" | "CHAOS" | "DARK"
                }))
        } else if (fs.existsSync(jsonPath)) {
            logger.info("Found data.json, parsing...")
            const fileContent = fs.readFileSync(jsonPath, "utf-8")
            cards = JSON.parse(fileContent)
        } else {
            logger.error("No data file found (data.csv or data.json)")
            throw new Error("No data file found")
        }

        // Clear existing cards
        await this.cardRepository.clear()

        // Insert new cards
        await this.cardRepository.save(cards)
        logger.info({ count: cards.length }, "Cards seeded successfully")
    }

    async getAllCards(): Promise<Card[]> {
        return this.cardRepository.find()
    }

    async getRandomCard(): Promise<Card | null> {
        // SQLite specific random ordering
        const card = await this.cardRepository
            .createQueryBuilder("card")
            .orderBy("RANDOM()")
            .getOne()

        return card
    }

    async clearAll(): Promise<void> {
        await this.cardRepository.clear()
        logger.info("All cards cleared")
    }

    async create(cardData: Partial<Card>): Promise<Card> {
        const card = this.cardRepository.create(cardData)
        return this.cardRepository.save(card)
    }
}
