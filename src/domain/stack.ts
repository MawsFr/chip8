export default class Stack {
    private readonly slots: Uint16Array = new Uint16Array(16)
    private currentIndex: number = 0 // TODO: move in registers

    push(returnAddress: number) {
        this.slots[this.currentIndex] = returnAddress
        this.currentIndex++
    }

    pop() {
        this.currentIndex--
        const returnAddress = this.slots[this.currentIndex]

        this.slots[this.currentIndex] = 0x0

        return returnAddress
    }

    reset() {
        this.slots.fill(0)
        this.currentIndex = 0
    }
}