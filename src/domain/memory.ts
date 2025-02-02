import type Registers from "./registers.ts";

export default class Memory {
    private readonly registers: Registers;
    private readonly addresses: Uint8Array = new Uint8Array(4096);

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
        return this.addresses[index]
    }

    load(data: Uint8Array | number[], start: number = this.registers.getI()) {
        for (const [ i, value ] of Array.from(data).entries()) {
            this.addresses[start + i] = value
        }
    }

    getSpriteData(height: number) {
        return this.addresses.slice(this.registers.getI(), this.registers.getI() + height)
    }

    entries(start: number, end: number) {
        return this.addresses.slice(start, end + 1)
    }

    reset() {
        this.addresses.fill(0)
        this.loadFontSet()
    }

    * [Symbol.iterator]() {
        for (const address of this.addresses) {
            yield address
        }
    }
}