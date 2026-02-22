import { EntityTarget } from "typeorm"

export const INJECT_REPOSITORY_METADATA = "INJECT_REPOSITORY_METADATA"

export function InjectRepository(entity: EntityTarget<unknown>) {
    return function (target: unknown, propertyKey: string | symbol | undefined, parameterIndex?: number) {
        if (parameterIndex !== undefined) {
            // Constructor parameter injection
            const existingParameters = Reflect.getOwnMetadata(INJECT_REPOSITORY_METADATA, target as object) || []
            existingParameters.push({ index: parameterIndex, entity })
            Reflect.defineMetadata(INJECT_REPOSITORY_METADATA, existingParameters, target as object)
        }
    }
}
