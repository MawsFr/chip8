import Memory from "./memory.ts";
import Registers from "./registers.ts";
import { expect } from "vitest";

describe('Memory', () => {
    let memory: Memory
    let registers: Registers

    beforeEach(() => {
        registers = new Registers()
        memory = new Memory(registers)
    })

    it('should have 4096 octet addresses', () => {

        expect(memory).to.have.property('addresses').which
            .is.instanceof(Uint8Array)
            .and.has.length(4096)

        expect(memory).property('addresses').contains([
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

    describe('getDataAt()', () => {
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

    describe('load()', () => {
        it('should load data into memory at I position', () => {
            registers.setI(0x200)
            memory.load([
                0xC0,
                0x20,
            ])

            expect(memory.getDataAt(0x200)).to.equal(0xC0)
            expect(memory.getDataAt(0x201)).to.equal(0x20)
        });
    });

    describe('getSprite()', () => {
        it('should return the sprite of length n', () => {
            registers.setI(0x200)
            memory.load([
                0xC0,
                0x20,
            ])

            const sprite = memory.getSprite(2)

            expect(sprite).to.deep.equal(Uint8Array.from([
                0xC0,
                0x20,
            ]))
        });
    });
})