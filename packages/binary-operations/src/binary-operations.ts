export const concatBytes = (highByte: number, lowByte: number): number => {
    return bitwiseOr(shiftLeftBy8(highByte), lowByte)
}

export const bitwiseOr = (num1: number, num2: number): number => num1 | num2
export const bitwiseXor = (num1: number, num2: number): number => num1 ^ num2
export const bitwiseAnd = (num1: number, num2: number): number => num1 & num2

export const masks = {
    SECOND_DIGIT: 0x0F00,
    THIRD_DIGIT: 0x00F0,
    FOURTH_DIGIT: 0x000F,
    TWO_LAST_DIGITS: 0x00FF,
    THREE_LAST_DIGITS: 0x0FFF,
}

export const shiftRightBy = (offset: number) => (num: number): number => num >> offset
export const shiftLeftBy = (offset: number) => (num: number): number => num << offset

export const shiftRightBy8 = shiftRightBy(8)
export const shiftLeftBy8 = shiftLeftBy(8)

export const shiftRightBy4 = shiftRightBy(4)

export const shiftRightBy1 = shiftRightBy(1)
export const shiftLeftBy1 = shiftLeftBy(1)

export const shiftRightBy7 = shiftRightBy(7)

export const isolate2ndDigit = (num: number): number => shiftRightBy8(bitwiseAnd(num, masks.SECOND_DIGIT))
export const isolate3rdDigit = (num: number): number => shiftRightBy4(bitwiseAnd(num, masks.THIRD_DIGIT))
export const isolate4thDigit = (num: number): number => bitwiseAnd(num, masks.FOURTH_DIGIT)

export const isolate2LastDigits = (num: number): number => bitwiseAnd(num, masks.TWO_LAST_DIGITS)
export const isolate3LastDigits = (num: number): number => bitwiseAnd(num, masks.THREE_LAST_DIGITS)

export const isolateLeastSignificantBit = (num: number): number => bitwiseAnd(num, 0x01)
export const isolateMostSignificantBit = (num: number): number => shiftRightBy7(num)

export const isBitSet = (num: number, bitIndex: number): boolean => {
    const shiftRightByBitIndex = shiftRightBy(bitIndex)
    const bitMask = shiftRightByBitIndex(0x80)

    return bitwiseAnd(num, bitMask) !== 0;
}