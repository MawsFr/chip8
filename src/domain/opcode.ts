export class Opcode {
    public readonly value: number;

    constructor(value: number) {
        this.value = value;
    }

    extractNNN(): NNN {
        return this.value & 0x0FFF;
    }

    extractNN(): NN {
        return this.value & 0x00FF;
    }

    extractN(): N {
        return this.value & 0x000F;
    }

    extractX(): X {
        return (this.value & 0x0F00) >> 8;
    }

    extractY(): Y {
        return (this.value & 0x00F0) >> 4;
    }

    toString(): string {
        return this.value.toString(16).padStart(4, '0').toUpperCase()
    }

}

export type NNN = number;
export type NN = number;
export type N = number;
export type X = number;
export type Y = number;