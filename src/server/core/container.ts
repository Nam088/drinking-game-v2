import { AppDataSource, initializeDB } from "./database"
import { INJECT_REPOSITORY_METADATA } from "@common/decorators/inject-repository.decorator"

export class Container {
    private static instances = new Map<any, any>()

    static async get<T>(serviceClass: new (...args: any[]) => T): Promise<T> {
        if (!this.instances.has(serviceClass)) {
            await initializeDB()
            // Resolve dependencies
            const injectedRepositories: { index: number; entity: any }[] =
                Reflect.getMetadata(INJECT_REPOSITORY_METADATA, serviceClass) || []

            const args: any[] = []
            injectedRepositories.forEach((dep) => {
                args[dep.index] = AppDataSource.getRepository(dep.entity)
            })

            this.instances.set(serviceClass, new serviceClass(...args))
        }
        return this.instances.get(serviceClass)
    }

    static register<T>(serviceClass: new (...args: any[]) => T, instance: T) {
        this.instances.set(serviceClass, instance)
    }
}
