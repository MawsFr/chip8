export class Input {
    public keys: Boolean[] = Array(16).fill(false)
    public resolveKey: Function | null = null

    press(key: number) {
        this.keys[key] = true
        if (this.resolveKey) {
            this.resolveKey(key)
            this.resolveKey = null
        }
    }

    release(key: number) {
        this.keys[key] = false
    }

    isPressed(key: number) {
        return this.keys[key]
    }

    waitForPress() {
        return new Promise<number>((resolve: Function) => {
            this.resolveKey = resolve
        })
    }

    clear() {
        this.keys.fill(false)
        this.resolveKey = null
    }
}