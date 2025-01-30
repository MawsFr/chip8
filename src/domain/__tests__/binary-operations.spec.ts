import { BinaryOperations } from "../binary-operations.ts";

describe('BinaryOperations', () => {
    it('should concat two bytes', () => {
        const byte1 = 0x10
        const byte2 = 0x20

        const result = BinaryOperations.concatBytes(byte1, byte2)

        expect(result).to.equal(0x1020)
    });
});