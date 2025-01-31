export const concatBytes = (highByte: number, lowByte: number): number => {
    return bitwiseOr((highByte << 8), lowByte)
}

export const bitwiseXor = (num1: number, num2: number): number => num1 ^ num2
export const bitwiseAnd = (num1: number, num2: number): number => num1 & num2
export const bitwiseOr = (num1: number, num2: number): number => num1 | num2

export function* bitIterator(num: number): IterableIterator<number> {
    for (let i = 0; i < 8; i++) {
        yield (num >> i) & 1
    }
}