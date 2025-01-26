export class Timer {
    public value: number = 0;
    public interval: number | null = null;

    getInterval() {
        return this.interval
    }

    read() {
        return this.value
    }

    write(newValue: number) {
        this.value = newValue
    }

    tick() {
        if (this.value <= 0) {
            return;
        }

        this.value--
    }

    countDownToZero() {
        this.interval = setInterval(() => {
            if (this.value <= 0) {
                this.stopCountDown()
                return
            }

            this.tick()
        }, 16)
    }

    stopCountDown() {
        if (!this.interval) {
            return
        }

        clearInterval(this.interval)
        this.interval = null
    }
}