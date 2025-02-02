export class Input {
    private _keys: boolean[] = Array(16).fill(false)
    private _resolveKey: Function | null = null

    get keys() {
        return this._keys
    }

    get resolveKey() {
        return this._resolveKey
    }

    press(key: number) {
        this._keys[key] = true
        if (this._resolveKey) {
            this._resolveKey(key)
            this._resolveKey = null
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
            this._resolveKey = resolve
        })
    }

    reset() {
        this._keys.fill(false)
        this._resolveKey = null
    }
}