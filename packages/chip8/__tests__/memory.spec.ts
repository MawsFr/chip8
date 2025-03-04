import { Memory, Registers, Sprite } from "../src";
import { beforeEach, describe, expect, it } from "vitest";

describe(Memory, () => {
    let memory: Memory
    let registers: Registers

    beforeEach(() => {
        registers = new Registers()
        memory = new Memory(registers)
    })

    it('should have 4096 octet addresses', () => {

        expect(memory.addresses)
            .to.be.an.instanceof(Uint8Array)
            .and.have.length(4096)

        expect(memory.addresses).contains([
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
        ])
    })

    describe(Memory.prototype.getDataAt, () => {
        it('should return data at provided index', () => {
            registers.setI(0x200)
            memory.load([
                0xC0,
                0x20,
            ])

            expect(memory.getDataAt(0x200)).to.equal(0xC0)
            expect(memory.getDataAt(0x201)).to.equal(0x20)
        });
    });

    describe(Memory.prototype.load, () => {
        it('should load data into memory at I position', () => {
            registers.setI(0x200)
            memory.load([
                0xC0,
                0x20,
                0x52
            ])

            expect(memory.getDataAt(0x200)).to.equal(0xC0)
            expect(memory.getDataAt(0x201)).to.equal(0x20)
            expect(memory.getDataAt(0x202)).to.equal(0x52)
        });
    });

    describe(Memory.prototype.getSprite, () => {
        it('should return the sprite data at I position', () => {
            registers.setI(0x200)
            memory.load([
                0xC0,
                0x20,
            ])

            const sprite = memory.getSprite(2)

            expect(sprite).to.deep.equal(new Sprite(Uint8Array.from([
                0xC0,
                0x20,
            ])))
        });
    });

    describe(Memory.prototype.entries, () => {
        it('should return range of entries', () => {
            registers.setI(0)
            memory.load([
                0xC0,
                0x20,
            ])

            const entries = memory.entries(0, 1)

            expect(entries).to.deep.equal(Uint8Array.from([
                0xC0,
                0x20,
            ]))

        });
    });

    describe(Memory.prototype[Symbol.iterator], () => {
        it('should iterate over memory addresses', () => {
            registers.setI(0)
            memory.addresses.fill(0)
            memory.load([
                0xC0,
                0x20,
            ])

            const entries = Array.from(memory)

            expect(entries.slice(0, 2)).to.deep.equal([
                0xC0,
                0x20,
            ])

        });
    });
})