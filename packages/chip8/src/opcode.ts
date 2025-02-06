import {
    isolate2LastDigits,
    isolate2ndDigit,
    isolate3LastDigits,
    isolate3rdDigit,
    isolate4thDigit
} from "@mawsfr/binary-operations";

export type NNNAddress = number;
export type NN = number;
export type N = number;
export type RegisterIndex = number;

export class Opcode {
    private readonly _value: number;

    get value(): number {
        return this._value;
    }

    constructor(value: number) {
        this._value = value;
    }

    extractNNN(): NNNAddress {
        return isolate3LastDigits(this._value);
    }

    extractNN(): NN {
        return isolate2LastDigits(this._value);
    }

    extractN(): N {
        return isolate4thDigit(this._value);
    }

    extractX(): RegisterIndex {
        return isolate2ndDigit(this._value);
    }

    extractY(): RegisterIndex {
        return isolate3rdDigit(this._value);
    }

    toString(): string {
        return this._value.toString(16).padStart(4, '0').toUpperCase()
    }

}