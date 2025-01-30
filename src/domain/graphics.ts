export class Graphics {
    public pixels: boolean[] = Array(2048).fill(false)

    getPixelAt(index: number) {
        return this.pixels[index]
    }

    drawPixel(index: number, pixel: 0 | 1) {
        const oldPixel = this.getPixelAt(index)

        this.pixels[index] = Boolean(Number(this.pixels[index]) ^ pixel)

        return { wasAlive: oldPixel }
    }

    clearScreen() {
        this.pixels.fill(false)
    }

    drawSprite(x: number, y: number, sprite: Uint8Array) {
        const spriteHeight = sprite.length
        let wasOverlapping = false

        for (let i = 0; i < spriteHeight; ++i) {
            const line = sprite[i].toString(2).padStart(8, '0')
            const didOverlap = line.split('').reduce((prev, pixel, index) => {
                const { wasAlive } = this.drawPixel((x + index) % 64 + ((y + i) % 32) * 64, Number(pixel) as 0 | 1)
                return prev || wasAlive
            }, false)

            wasOverlapping = wasOverlapping || didOverlap
        }

        return { wasOverlapping }
    }
}