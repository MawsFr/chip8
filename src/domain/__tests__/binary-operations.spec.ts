import { bitwiseAnd, bitwiseOr, bitwiseXor, concatBytes } from "../binary-operations.ts";

describe('BinaryOperations', () => {
    describe(concatBytes, () => {
        it('should concat two bytes', () => {
            const byte1 = 0x10
            const byte2 = 0x20

            const result = concatBytes(byte1, byte2)

            expect(result).to.equal(0x1020)
        });
    });

    describe(bitwiseXor, () => {
        it('should xor two numbers', () => {
            const num1 = 0b1010
            const num2 = 0b1100

            const result = bitwiseXor(num1, num2)

            expect(result).to.equal(0b0110)
        });
    });

    describe(bitwiseAnd, () => {
        it('should and two numbers', () => {
            const num1 = 0b1010
            const num2 = 0b1100

            const result = bitwiseAnd(num1, num2)

            expect(result).to.equal(0b1000)
        });
    });

    describe(bitwiseOr, () => {
        it('should or two numbers', () => {
            const num1 = 0b1010
            const num2 = 0b1100

            const result = bitwiseOr(num1, num2)

            expect(result).to.equal(0b1110)
        });
    });
});