import { NextRequest, NextResponse } from "next/server"
import { ValidationError } from "../errors/validation.error"
import { createLogger } from "./logger"

const logger = createLogger("ErrorHandler")

/**
 * Centralized error handler for API routes
 */
export function handleApiError(error: unknown, request?: NextRequest) {
    // Log error with request context
    const errorContext = {
        error: error instanceof Error ? error.message : String(error),
        path: request?.nextUrl?.pathname,
        method: request?.method,
    }
    logger.error(errorContext, "API Error")

    // Handle validation errors
    if (error instanceof ValidationError) {
        return NextResponse.json(
            {
                success: false,
                error: "Validation failed",
                details: error.errors,
            },
            { status: 400 }
        )
    }

    // Handle other errors
    return NextResponse.json(
        {
            success: false,
            error: error instanceof Error ? error.message : "Internal server error",
        },
        { status: 500 }
    )
}

/**
 * Wrapper for API route handlers with automatic error handling
 */
export function withErrorHandler<T extends (request: NextRequest) => Promise<NextResponse>>(
    handler: T
): T {
    return (async (request: NextRequest) => {
        try {
            return await handler(request)
        } catch (error) {
            return handleApiError(error, request)
        }
    }) as T
}
