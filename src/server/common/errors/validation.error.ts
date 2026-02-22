export class ValidationError extends Error {
    constructor(public errors: unknown) {
        super("Validation failed")
        this.name = "ValidationError"
    }
}
