export class Input {
    public keys: Boolean[] = Array(16).fill(false)

    press(key: number) {
        this.keys[key] = true
    }

    release(key: number) {
        this.keys[key] = false
    }

    isPressed(key: number) {
        return this.keys[key]
    }
}