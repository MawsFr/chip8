export default class Stack {
    public slots: Uint16Array = new Uint16Array(16)
    public currentIndex: number = 0

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