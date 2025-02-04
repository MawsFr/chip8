import Registers from "../registers.ts";
import { expect } from "vitest";

describe(Registers, () => {
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

    describe(Registers.prototype.getV, () => {
        it('should get the register value', () => {
            registers.setV(0, 0x20)

            expect(registers.getV(0)).to.equal(0x20)
        });
    });

    describe(Registers.prototype.setV, () => {
        it('should set a V slot to new value', () => {
            registers.setV(0, 0x20)

            expect(registers.getV(0)).to.equal(0x20)
        });
    });

    describe(Registers.prototype.addV, () => {
        it('should add a value to a V slot without carry flag', () => {
            registers.setV(0, 0x20)
            registers.addV(0, 0x10)

            expect(registers.getV(0)).to.equal(0x30)
        });

        it('should add a value to a V slot with carry flag', () => {
            registers.setV(0, 0xFF)
            registers.addV(0, 0x2, { carryFlag: true })

            expect(registers.getV(0)).to.equal(0x01)
            expect(registers.getV(0xF)).to.equal(1)
        });
    });

    describe(Registers.prototype.setI, () => {
        it('should set I slot value', () => {
            registers.setI(0x20)

            expect(registers.getI()).to.equal(0x20)
        });
    });

    describe(Registers.prototype.getI, () => {
        it('should return I slot value', () => {
            registers.setI(0x20)

            expect(registers.getI()).to.equal(0x20)
        });
    });

    describe(Registers.prototype.addI, () => {
        it('should add a value to I slot', () => {
            registers.setI(0x20)
            registers.addI(0x10)

            expect(registers.getI()).to.equal(0x30)
        });
    });

    describe(Registers.prototype.subtract, () => {
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

    describe(Registers.prototype.randomize, () => {
        it('should randomize a V slot value', () => {
            vi.spyOn(Math, 'random').mockReturnValue(0.1)

            registers.randomize(0, 0x10)

            expect(registers.getV(0)).to.equal(0x10)
        });
    });

    describe(Registers.prototype.shiftRight, () => {
        it('should shift a V slot value to the right', () => {
            registers.setV(0, 0b1011)

            registers.shiftRight(0)

            expect(registers.getV(0)).to.equal(0b0101)
            expect(registers.getV(0xF)).to.equal(1)
        });
    });

    describe(Registers.prototype.shiftLeft, () => {
        it('should shift a V slot value to the left', () => {
            registers.setV(0, 0xFF)

            registers.shiftLeft(0)

            expect(registers.getV(0)).to.equal(0xFE)
            expect(registers.getV(0xF)).to.equal(1)
        });
    });

    describe(Registers.prototype.entries, () => {
        it('should return values between VX and VY (included)', () => {
            registers.setV(0, 0x123)
            registers.setV(1, 0x456)
            registers.setV(2, 0x789)

            const values = registers.entries(0, 2)

            expect(values).to.deep.equal(Uint8Array.from([ 0x123, 0x456, 0x789 ]))
        });

    });

    describe(Registers.prototype.load, () => {
        it('should load values into registers', () => {
            registers.load([ 0x20, 0x30, 0x40 ])

            expect(registers.getV(0)).to.equal(0x20)
            expect(registers.getV(1)).to.equal(0x30)
            expect(registers.getV(2)).to.equal(0x40)
        });
    });
})