import type { RegisterIndex } from "./opcode.ts";

export type AddVParams = { carryFlag: boolean };

export default class Registers {
    public vSlots: Uint8Array = new Uint8Array(16);
    public iSlot: Uint16Array = new Uint16Array(1);

    getV(index: RegisterIndex) {
        return this.vSlots[index] & 0xFF
    }

    setV(index: RegisterIndex, newValue: number) {
        this.vSlots[index] = newValue & 0xFF
    }

    getI() {
        return this.iSlot[0] & 0xFFF
    }

    setI(newValue: number) {
        this.iSlot[0] = newValue & 0xFFF
    }

    entries(start: number, end: number) {
        return this.vSlots.slice(start, end + 1)
    }

    load(entries: Uint8Array | number[]) {
        for (const [ i, value ] of Array.from(entries).entries()) {
            this.setV(i, value)
        }
    }

    addV(x: RegisterIndex, addValue: number, { carryFlag }: AddVParams = { carryFlag: false }) {
        const addResult = this.getV(x) + addValue

        this.setV(x, addResult)
        this.setV(0xF,
            carryFlag
            && addResult > 0xFF
                ? 1
                : 0
        )
    }

    addI(addValue: number) {
        const addResult = this.getI() + addValue

        this.setI(addResult)
    }

    subtractVXByVY(x: RegisterIndex, y: RegisterIndex) {
        const minuend = this.getV(x)
        const subtrahend = this.getV(y)
        const subtractResult = minuend - subtrahend

        this.setV(x, subtractResult)
        this.setV(0xF, minuend > subtrahend ? 1 : 0)
    }

    shiftRight(x: RegisterIndex) {
        const value = this.getV(x)

        this.setV(x, value >> 1)
        this.setV(0xF, value & 0x1)
    }

    shiftLeft(x: RegisterIndex) {
        const value = this.getV(x)

        this.setV(x, value << 1)
        this.setV(0xF, (value & 0x80) >> 7)
    }

    reset() {
        this.vSlots.fill(0)
        this.iSlot.fill(0)
    }
}