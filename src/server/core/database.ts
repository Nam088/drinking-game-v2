import "reflect-metadata"
import { DataSource } from "typeorm"
import { Card } from "@modules/cards/card.entity"

export const AppDataSource = new DataSource({
    type: "better-sqlite3",
    database: "database.sqlite",
    synchronize: true,
    logging: false,
    entities: [Card],
    migrations: [],
    subscribers: [],
})

export const initializeDB = async () => {
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize()
    }
    return AppDataSource
}
