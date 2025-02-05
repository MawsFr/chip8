export const NB_KEYS = 16;

export class Input {
    private readonly _keys: boolean[] = Array(NB_KEYS).fill(false)
    private resolveKey: Function | null = null

    get keys() {
        return this._keys
    }

    get isAwaitingForKey() {
        return !!this.resolveKey
    }

    press(key: number) {
        this._keys[key] = true
        if (this.resolveKey) {
            this.resolveKey(key)
            this.resolveKey = null
        }
    }

    release(key: number) {
        this._keys[key] = false
    }

    isPressed(key: number) {
        return this._keys[key]
    }

    waitForPress() {
        return new Promise<number>((resolve: Function) => {
            this.resolveKey = resolve
        })
    }

    reset() {
        this._keys.fill(false)
        this.resolveKey = null
    }
}