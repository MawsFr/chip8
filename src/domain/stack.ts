export default class Stack {
    private readonly slots: Uint16Array = new Uint16Array(16)
    private currentIndex: number = 0 // TODO: move in registers

    push(address: number) {
        this.slots[this.currentIndex] = address
        this.currentIndex++
    }

    pop() {
        this.currentIndex--
        const nextReturnAddress = this.slots[this.currentIndex]
        this.slots[this.currentIndex] = 0x0

        return nextReturnAddress
    }

    reset() {
        this.slots.fill(0)
        this.currentIndex = 0
    }
}