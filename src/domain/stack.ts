export default class Stack {
    private readonly _slots: Uint16Array = new Uint16Array(16)
    private currentIndex: number = 0 // TODO: move in registers

    get slots() {
        return this._slots
    }

    push(returnAddress: number) {
        this._slots[this.currentIndex] = returnAddress
        this.currentIndex++
    }

    pop() {
        this.currentIndex--
        const returnAddress = this._slots[this.currentIndex]

        this._slots[this.currentIndex] = 0x0

        return returnAddress
    }

    reset() {
        this._slots.fill(0)
        this.currentIndex = 0
    }
}