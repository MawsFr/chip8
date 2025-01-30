export class Timer {
    public value: number = 0;

    read() {
        return this.value & 0xFF
    }

    write(newValue: number) {
        this.value = newValue & 0xFF
    }

    tick() {
        if (this.value <= 0) {
            return;
        }

        this.value--
    }
}