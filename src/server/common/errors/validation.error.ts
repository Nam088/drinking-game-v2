export class ValidationError extends Error {
    constructor(public errors: any) {
        super("Validation failed")
        this.name = "ValidationError"
    }
}
