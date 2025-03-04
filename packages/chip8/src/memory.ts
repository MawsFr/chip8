import type { Registers } from "./registers.ts";
import { Sprite } from "./sprite.ts";
import { inclusive } from "@mawsfr/math-operations"

export const MEMORY_SIZE = 4096;

export class Memory {
    private readonly registers: Registers;
    private readonly _addresses: Uint8Array = new Uint8Array(MEMORY_SIZE);

    get addresses() {
        return this._addresses
    }

    constructor(registers: Registers) {
        this.registers = registers
        this.loadFontSet()
    }

    loadFontSet() {
        this.load(new Uint8Array([
            0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
            0x20, 0x60, 0x20, 0x20, 0x70, // 1
            0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
            0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
            0x90, 0x90, 0xF0, 0x10, 0x10, // 4
            0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
            0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
            0xF0, 0x10, 0x20, 0x40, 0x40, // 7
            0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
            0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
            0xF0, 0x90, 0xF0, 0x90, 0x90, // A
            0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
            0xF0, 0x80, 0x80, 0x80, 0xF0, // C
            0xE0, 0x90, 0x90, 0x90, 0xE0, // D
            0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
            0xF0, 0x80, 0xF0, 0x80, 0x80  // F
        ]), 0x0)
    }

    getDataAt(index: number) {
        return this._addresses[index]
    }

    load(data: Uint8Array | number[], start: number = this.registers.getI()) {
        for (const [ i, value ] of Array.from(data).entries()) {
            this._addresses[start + i] = value
        }
    }

    getSprite(height: number) {
        return new Sprite(this._addresses.slice(this.registers.getI(), this.registers.getI() + height))
    }

    entries(start: number, end: number) {
        return this._addresses.slice(start, inclusive(end))
    }

    reset() {
        this._addresses.fill(0)
        this.loadFontSet()
    }

    * [Symbol.iterator]() {
        for (const address of this._addresses) {
            yield address
        }
    }
}