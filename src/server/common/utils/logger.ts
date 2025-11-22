import pino from "pino"

// Create base logger instance
// Note: pino-pretty is disabled because it causes "worker has exited" errors in Next.js
const baseLogger = pino({
    level: process.env.LOG_LEVEL || "info",
    formatters: {
        level: (label) => {
            return { level: label.toUpperCase() }
        },
    },
})

/**
 * Create a named logger for a specific module
 * @param name - The name/module of the logger (e.g., 'UserService', 'API', 'Database')
 */
export function createLogger(name: string) {
    return baseLogger.child({ module: name })
}

// Default logger
export const logger = createLogger("App")
