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

    describe('addI()', () => {
        it('should add a value to I slot', () => {
            registers.setI(0x20)
            registers.addI(0x10)

            expect(registers.getI()).to.equal(0x30)
        });
    });

    describe('subtract()', () => {
        it('should subtract a V slot value from another', () => {
            registers.setV(0, 0x20)
            registers.setV(1, 0x10)

            registers.subtract({
                resultDestinationIndex: 0,
                minuendIndex: 0,
                subtrahendIndex: 1
            })

            expect(registers.getV(0)).to.equal(0x10)
        });
    });

    describe('randomize()', () => {
        it('should randomize a V slot value', () => {
            vi.spyOn(Math, 'random').mockReturnValue(0.1)

            registers.randomize(0, 0x10)

            expect(registers.getV(0)).to.equal(0x10)
        });
    });

    describe('shiftRight()', () => {
        it('should shift a V slot value to the right', () => {
            registers.setV(0, 0b1011)

            registers.shiftRight(0)

            expect(registers.getV(0)).to.equal(0b0101)
            expect(registers.getV(0xF)).to.equal(1)
        });
    });

    describe('shiftLeft()', () => {
        it('should shift a V slot value to the left', () => {
            registers.setV(0, 0xFF)

            registers.shiftLeft(0)

            expect(registers.getV(0)).to.equal(0xFE)
            expect(registers.getV(0xF)).to.equal(1)
        });
    });

    describe('getRange()', () => {
        it('should return values between VX and VY (included)', () => {
            registers.setV(0, 0x123)
            registers.setV(1, 0x456)
            registers.setV(2, 0x789)

            const values = registers.entries(0, 2)

            expect(values).to.deep.equal(Uint8Array.from([ 0x123, 0x456, 0x789 ]))
        });

    });

    describe('load()', () => {
        it('should load values into registers', () => {
            registers.load([ 0x20, 0x30, 0x40 ])

            expect(registers.getV(0)).to.equal(0x20)
            expect(registers.getV(1)).to.equal(0x30)
            expect(registers.getV(2)).to.equal(0x40)
        });
    });
})