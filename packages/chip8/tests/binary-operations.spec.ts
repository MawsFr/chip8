import { describe, expect, it } from "vitest";
import {
    bitwiseAnd,
    bitwiseOr,
    bitwiseXor,
    concatBytes,
    isBitSet,
    isolate2LastDigits,
    isolate2ndDigit,
    isolate3LastDigits,
    isolate3rdDigit,
    isolate4thDigit,
    isolateLeastSignificantBit,
    isolateMostSignificantBit,
    shiftLeftBy,
    shiftLeftBy1,
    shiftLeftBy8,
    shiftRightBy,
    shiftRightBy1,
    shiftRightBy4,
    shiftRightBy7,
    shiftRightBy8
} from "../src";

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

    describe(shiftRightBy, () => {
        it('should shift right', () => {
            const num = 0b1010

            const result = shiftRightBy(1)(num)

            expect(result).to.equal(0b0101)
        });
    });

    describe(shiftLeftBy, () => {
        it('should shift left', () => {
            const num = 0b1010

            const result = shiftLeftBy(1)(num)

            expect(result).to.equal(0b10100)
        });
    });

    describe(shiftRightBy8, () => {
        it('should shift right by 8', () => {
            const num = 0x1234

            const result = shiftRightBy8(num)

            expect(result).to.equal(0x12)
        });
    });

    describe(shiftLeftBy8, () => {
        it('should shift left by 8', () => {
            const num = 0x1234

            const result = shiftLeftBy8(num)

            expect(result).to.equal(0x123400)
        });
    });

    describe(shiftRightBy4, () => {
        it('should shift right by 4', () => {
            const num = 0x1234

            const result = shiftRightBy4(num)

            expect(result).to.equal(0x123)
        });
    });

    describe(shiftRightBy1, () => {
        it('should shift right by 1', () => {
            const num = 0b1010

            const result = shiftRightBy1(num)

            expect(result).to.equal(0b0101)
        });
    });

    describe(shiftLeftBy1, () => {
        it('should shift left by 1', () => {
            const num = 0b1010

            const result = shiftLeftBy1(num)

            expect(result).to.equal(0b10100)
        });
    });

    describe(shiftRightBy7, () => {
        it('should shift right by 7', () => {
            const num = 0b10000000

            const result = shiftRightBy7(num)

            expect(result).to.equal(0b1)
        });
    });

    describe(isolate2ndDigit, () => {
        it('should isolate the second digit', () => {
            const num = 0x1234

            const result = isolate2ndDigit(num)

            expect(result).to.equal(0x2)
        });
    });

    describe(isolate3rdDigit, () => {
        it('should isolate the third digit', () => {
            const num = 0x1234

            const result = isolate3rdDigit(num)

            expect(result).to.equal(0x3)
        });
    });

    describe(isolate4thDigit, () => {
        it('should isolate the fourth digit', () => {
            const num = 0x1234

            const result = isolate4thDigit(num)

            expect(result).to.equal(0x4)
        });
    });

    describe(isolate2LastDigits, () => {
        it('should isolate the two last digits', () => {
            const num = 0x1234

            const result = isolate2LastDigits(num)

            expect(result).to.equal(0x34)
        });
    });

    describe(isolate3LastDigits, () => {
        it('should isolate the three last digits', () => {
            const num = 0x1234

            const result = isolate3LastDigits(num)

            expect(result).to.equal(0x234)
        });
    });

    describe(isolateLeastSignificantBit, () => {
        it('should isolate the least significant bit', () => {
            const num = 0b00000001

            const result = isolateLeastSignificantBit(num)

            expect(result).to.equal(0b1)
        });
    });

    describe(isolateMostSignificantBit, () => {
        it('should isolate the most significant bit', () => {
            const num = 0b10000000

            const result = isolateMostSignificantBit(num)

            expect(result).to.equal(0b1)
        });
    });

    describe(isBitSet, () => {
        it('should check if a bit is set', () => {
            const num = 0b10000000

            const result = isBitSet(num, 0)

            expect(result).toBeTruthy()
        });
    });

    describe(isBitSet, () => {
        it('should check if a bit is not set', () => {
            const num = 0b11111110

            const result = isBitSet(num, 7)

            expect(result).toBeFalsy()
        });
    });
});