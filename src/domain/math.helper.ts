export const extractHundreds = (number: number): number => {
    return Math.floor(number / 100)
}

export const extractTens = (number: number): number => {
    return Math.floor((number % 100) / 10)
}

export const extractOnes = (number: number): number => {
    return number % 10
}