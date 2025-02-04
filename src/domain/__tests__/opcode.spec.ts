import { type N, type NN, type NNNAddress, Opcode, type RegisterIndex } from "../opcode.ts";

describe(Opcode, () => {
    describe(Opcode.prototype.extractX, () => {
        it('should extract X from opcode', () => {
            const opcode = new Opcode(0x0C00)

            const x: RegisterIndex = opcode.extractX()

            expect(x).toBe(0x0C)
        });
    });

    describe(Opcode.prototype.extractY, () => {
        it('should extract Y from opcode', () => {
            const opcode = new Opcode(0x00C0)

            const y: RegisterIndex = opcode.extractY()

            expect(y).toBe(0x0C)
        });
    });

    describe(Opcode.prototype.extractNNN, () => {
        it('should extract NNN from opcode', () => {
            const opcode = new Opcode(0x0FFF)

            const nnn: NNNAddress = opcode.extractNNN()

            expect(nnn).toBe(0x0FFF)
        });
    });

    describe(Opcode.prototype.extractNN, () => {
        it('should extract NN from opcode', () => {
            const opcode = new Opcode(0x00FF)

            const nn: NN = opcode.extractNN()

            expect(nn).toBe(0x00FF)
        });
    });

    describe(Opcode.prototype.extractN, () => {
        it('should extract N from opcode', () => {
            const opcode = new Opcode(0x000F)

            const n: N = opcode.extractN()

            expect(n).toBe(0x000F)
        });
    });
});