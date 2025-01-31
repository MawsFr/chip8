import { extractHundreds, extractOnes, extractTens } from "../math.helper.ts";

describe('Math helper functions', () => {
    describe('extractHundreds()', () => {
        it('should return the hundreds digit of a number', () => {
            const hundreds = extractHundreds(123)
            expect(hundreds).toBe(1)
        });
    });

    describe('extractTens()', () => {
        it('should return the tens digit of a number', () => {
            const tens = extractTens(123)
            expect(tens).toBe(2)
        });
    });

    describe('extractOnes()', () => {
        it('should return the ones digit of a number', () => {
            const ones = extractOnes(123)
            expect(ones).toBe(3)
        });
    });
});