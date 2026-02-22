export function Service() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-function-type
    return function <T extends { new(...args: any[]): Function | object }>(constructor: T) {
        // We don't strictly need to do anything here if we lazy-load in Container.get
        // But we could register it eagerly if we wanted.
        // For now, just marking it is enough.
        return constructor
    }
}
