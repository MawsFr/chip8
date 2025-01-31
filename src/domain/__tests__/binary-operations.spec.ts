import { bitIterator, concatBytes, xor } from "../binary-operations.ts";

describe('BinaryOperations', () => {
    describe('concatBytes()', () => {
        it('should concat two bytes', () => {
            const byte1 = 0x10
            const byte2 = 0x20

            const result = concatBytes(byte1, byte2)

            expect(result).to.equal(0x1020)
        });
    });

    describe('xor()', () => {
        it('should xor two numbers', () => {
            const num1 = 0b1010
            const num2 = 0b1100

            const result = xor(num1, num2)

            expect(result).to.equal(0b0110)
        });
    });

    describe('bitIterator()', () => {
        it('should generate an iterator of each bits of a number', () => {
            const num = 0x88

            const bits = Array.from(bitIterator(num))

            expect(bits).to.deep.equal([ 0, 0, 0, 1, 0, 0, 0, 1 ]);
        });
    });

});