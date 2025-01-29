export default class Registers {
    public vSlots: Uint8Array = new Uint8Array(16);
    public iSlot: Uint16Array = new Uint16Array(1);

    getV(index: number) {
        return this.vSlots[index] & 0xFF
    }

    setV(index: number, newValue: number) {
        this.vSlots[index] = newValue & 0xFF
    }

    addV(index: number, newValue: number) {
        this.vSlots[index] += newValue & 0xFF
    }

    getI() {
        return this.iSlot[0] & 0xFFF
    }

    setI(newValue: number) {
        this.iSlot[0] = newValue & 0xFFF
    }

    getRange(start: number, end: number) {
        return this.vSlots.slice(start, end + 1)
    }

    clear() {
        this.vSlots.fill(0)
        this.iSlot.fill(0)
    }
}