import { ZodSchema } from "zod"
import { ValidationError } from "../errors/validation.error"

export function Validate<T>(schema: ZodSchema<T>) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        const originalMethod = descriptor.value

        descriptor.value = async function (...args: any[]) {
            // Validate the first argument
            const result = schema.safeParse(args[0])
            if (!result.success) {
                throw new ValidationError(result.error.format())
            }

            // Call the original method with validated data
            return originalMethod.apply(this, [result.data, ...args.slice(1)])
        }

        return descriptor
    }
}
