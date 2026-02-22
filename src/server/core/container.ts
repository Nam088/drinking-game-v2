import { AppDataSource, initializeDB } from "./database"
import { INJECT_REPOSITORY_METADATA } from "@common/decorators/inject-repository.decorator"

export class Container {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private static instances = new Map<new (...args: any[]) => any, unknown>()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static async get<T>(serviceClass: new (...args: any[]) => T): Promise<T> {
        if (!this.instances.has(serviceClass)) {
            await initializeDB()
            // Resolve dependencies
            const injectedRepositories: { index: number; entity: unknown }[] =
                Reflect.getMetadata(INJECT_REPOSITORY_METADATA, serviceClass) || []

            const args: unknown[] = []
            injectedRepositories.forEach((dep) => {
                // @ts-expect-error - TypeORM typing mismatch for constructor
                args[dep.index] = AppDataSource.getRepository(dep.entity)
            })

            this.instances.set(serviceClass, new serviceClass(...args))
        }
        return this.instances.get(serviceClass) as T
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static register<T>(serviceClass: new (...args: any[]) => T, instance: T) {
        this.instances.set(serviceClass, instance)
    }
}
