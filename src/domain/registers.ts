export type AddVParams = { carryFlag: boolean };

export default class Registers {
    public vSlots: Uint8Array = new Uint8Array(16);
    public iSlot: Uint16Array = new Uint16Array(1);

    getV(index: number) {
        return this.vSlots[index] & 0xFF
    }

    setV(index: number, newValue: number) {
        this.vSlots[index] = newValue & 0xFF
    }

    addV(index: number, addValue: number, { carryFlag = false }: AddVParams = { carryFlag: false }) {
        const addResult = this.vSlots[index] + addValue
        this.vSlots[index] = addResult & 0xFF
        this.vSlots[0xF] = carryFlag && addResult > 0xFF ? 1 : 0
    }

    getI() {
        return this.iSlot[0] & 0xFFF
    }

    setI(newValue: number) {
        this.iSlot[0] = newValue & 0xFFF
    }

    addI(addValue: number) {
        const addResult = this.iSlot[0] + addValue
        this.iSlot[0] = addResult & 0xFFF
    }

    entries(start: number, end: number) {
        return this.vSlots.slice(start, end + 1)
    }

    load(entries: Uint8Array | number[]) {
        for (const [ i, value ] of Array.from(entries).entries()) {
            this.setV(i, value)
        }
    }

    reset() {
        this.vSlots.fill(0)
        this.iSlot.fill(0)
    }
}