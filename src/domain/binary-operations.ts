export class BinaryOperations {
    public static concatBytes(highByte: number, lowByte: number): number {
        return (highByte << 8) | lowByte
    }
}