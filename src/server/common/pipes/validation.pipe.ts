import { ZodSchema } from "zod"

export const validate = <T>(schema: ZodSchema<T>, data: unknown): T => {
    const result = schema.safeParse(data)
    if (!result.success) {
        throw new Error(JSON.stringify(result.error.format()))
    }
    return result.data
}
