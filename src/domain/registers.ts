import type { RegisterIndex } from "./opcode.ts";
import { bitwiseAnd } from "./binary-operations.ts";
import { inclusive } from "./math.helper.ts";

export type AddVParams = { carryFlag: boolean };

export default class Registers {
    private readonly _vSlots: Uint8Array = new Uint8Array(NB_V_SLOTS);
    private _iSlot: number = 0

    get vSlots() {
        return this._vSlots
    }

    get iSlot() {
        return this._iSlot
    }

    getV(index: RegisterIndex) {
        return this._vSlots[index]
    }

    setV(index: RegisterIndex, newValue: number) {
        this._vSlots[index] = newValue
    }

    getI() {
        return bitwiseAnd(this._iSlot, 0xFFF)
    }

    setI(newValue: number) {
        this._iSlot = bitwiseAnd(newValue, 0xFFF)
    }

    entries(start: number, end: number) {
        return this._vSlots.slice(start, inclusive(end))
    }

    load(entries: Uint8Array | number[]) {
        for (const [ i, value ] of Array.from(entries).entries()) {
            this.setV(i, value)
        }
    }

    addV(x: RegisterIndex, addValue: number, { carryFlag }: AddVParams = { carryFlag: false }) {
        const addResult = this.getV(x) + addValue

        this.setV(x, addResult)

        if (!carryFlag) {
            return
        }

        this.setV(0x0F, addResult > 0xFF ? 1 : 0)
    }

    addI(addValue: number) {
        const addResult = this.getI() + addValue

        this.setI(addResult)
    }

    subtract({ resultDestinationIndex, minuendIndex, subtrahendIndex }: {
        resultDestinationIndex: RegisterIndex,
        minuendIndex: RegisterIndex,
        subtrahendIndex: RegisterIndex
    }) {
        const minuend = this.getV(minuendIndex)
        const subtrahend = this.getV(subtrahendIndex)
        const subtractResult = minuend - subtrahend

        this.setV(resultDestinationIndex, subtractResult)
        this.setV(0xF, minuend >= subtrahend ? 1 : 0)
    }

    randomize(x: RegisterIndex, nn: number) {
        const randomNumber = Math.floor(Math.random() * (0xFF + 1))
        const value = bitwiseAnd(nn, randomNumber)

        this.setV(x, value)
    }

    shiftRight(x: RegisterIndex) {
        const value = this.getV(x)

        this.setV(x, value >> 1)
        this.setV(0xF, value & 0x01)
    }

    shiftLeft(x: RegisterIndex) {
        const value = this.getV(x)

        this.setV(x, value << 1)
        this.setV(0xF, (value & 0x80) >> 7)
    }

    reset() {
        this._vSlots.fill(0)
        this._iSlot = 0
    }
}