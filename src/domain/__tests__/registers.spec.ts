import Registers from "../registers.ts";
import { expect } from "vitest";

describe('Registers', () => {
    let registers: Registers

    beforeEach(() => {
        registers = new Registers()
    })

    it('should have 16 V slots', () => {
        expect(registers).to.have.property("vSlots").which
            .is.instanceof(Uint8Array)
            .and.has.length(16)
    })

    it('should have an I slot', () => {
        expect(registers).to.have.property("iSlot").which
            .is.instanceof(Uint16Array)
            .and.has.length(1)
    })

    describe('getV()', () => {
        it('should get the register value', () => {
            registers.setV(0, 0x20)

            expect(registers.getV(0)).to.equal(0x20)
        });
    });

    describe('setV()', () => {
        it('should set a V slot to new value', () => {
            registers.setV(0, 0x20)

            expect(registers.getV(0)).to.equal(0x20)
        });
    });

    describe('addV()', () => {
        it('should add a value to a V slot', () => {
            registers.setV(0, 0x20)
            registers.addV(0, 0x10)

            expect(registers.getV(0)).to.equal(0x30)
        });
    });

    describe('setI()', () => {
        it('should set I slot value', () => {
            registers.setI(0x20)

            expect(registers.getI()).to.equal(0x20)
        });
    });

    describe('getI()', () => {
        it('should return I slot value', () => {
            registers.setI(0x20)

            expect(registers.getI()).to.equal(0x20)
        });
    });

    describe('getRange()', () => {
        it('should return values between VX and VY (included)', () => {
            registers.setV(0, 0x123)
            registers.setV(1, 0x456)
            registers.setV(2, 0x789)

            const values = registers.getRange(0, 2)

            expect(values).to.deep.equal(Uint8Array.from([ 0x123, 0x456, 0x789 ]))
        });

    });
})