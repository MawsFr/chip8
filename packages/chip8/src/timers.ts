import { bitwiseAnd } from "@mawsfr/binary-operations";

export class Timer {
    private value: number = 0;

    read() {
        return bitwiseAnd(this.value, 0xFF)
    }

    write(newValue: number) {
        this.value = bitwiseAnd(newValue, 0xFF)
    }

    tick() {
        if (this.value <= 0) {
            return;
        }

        this.value--
    }

    reset() {
        this.value = 0
    }
}