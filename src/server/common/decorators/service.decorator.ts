import { Container } from "@core/container"

export function Service() {
    return function <T extends { new(...args: any[]): {} }>(constructor: T) {
        // We don't strictly need to do anything here if we lazy-load in Container.get
        // But we could register it eagerly if we wanted.
        // For now, just marking it is enough.
        return constructor
    }
}
