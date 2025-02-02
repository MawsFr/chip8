export class Opcode {
    private readonly _value: number;
    get value(): number {
        return this._value;
    }

    constructor(value: number) {
        this._value = value;
    }

    extractNNN(): NNNAddress {
        return this._value & 0x0FFF;
    }

    extractNN(): NN {
        return this._value & 0x00FF;
    }

    extractN(): N {
        return this._value & 0x000F;
    }

    extractX(): RegisterIndex {
        return (this._value & 0x0F00) >> 8;
    }

    extractY(): RegisterIndex {
        return (this._value & 0x00F0) >> 4;
    }

    toString(): string {
        return this._value.toString(16).padStart(4, '0').toUpperCase()
    }

}

export type NNNAddress = number;
export type NN = number;
export type N = number;
export type RegisterIndex = number;