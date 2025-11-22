import { EntityTarget } from "typeorm"

export const INJECT_REPOSITORY_METADATA = "INJECT_REPOSITORY_METADATA"

export function InjectRepository(entity: EntityTarget<any>) {
    return function (target: any, propertyKey: string | undefined, parameterIndex?: number) {
        if (parameterIndex !== undefined) {
            // Constructor parameter injection
            const existingParameters = Reflect.getOwnMetadata(INJECT_REPOSITORY_METADATA, target) || []
            existingParameters.push({ index: parameterIndex, entity })
            Reflect.defineMetadata(INJECT_REPOSITORY_METADATA, existingParameters, target)
        }
    }
}
