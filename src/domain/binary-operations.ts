export const concatBytes = (highByte: number, lowByte: number): number => {
    return (highByte << 8) | lowByte
}

export const xor = (num1: number, num2: number): number => num1 ^ num2

export function* bitIterator(num: number): IterableIterator<number> {
    for (let i = 0; i < 8; i++) {
        yield (num >> i) & 1
    }
}