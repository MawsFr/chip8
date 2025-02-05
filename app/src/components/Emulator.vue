<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef } from "vue";
import { State } from '@mawsfr/chip8'
import { useEmulator } from "../composables/useEmulator.ts";

const canvas = useTemplateRef('canvas')
let ctx: CanvasRenderingContext2D;

const { emulator } = useEmulator()

const manual = ref(false)
const showGrid = ref(false)
let loadedRom: Uint8Array | null = null

const loadFile = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input || !input.files || input.files.length === 0) {
    console.error("Aucun fichier sélectionné.");
    return;
  }

  const file = input.files[0];
  const reader = new FileReader()
  reader.onload = () => {
    const arrayBuffer = reader.result as ArrayBuffer;
    const byteArray = new Uint8Array(arrayBuffer);

    loadedRom = byteArray

    // Charger les données dans la mémoire
    emulator.value.loadROM(byteArray);

    scrollToCurrentAddress()

    console.log("Fichier chargé dans la mémoire :", byteArray);

    animate(canvas.value!, ctx)
  };

  reader.onerror = (error) => {
    console.error("Erreur lors de la lecture du fichier :", error);
  };

  reader.readAsArrayBuffer(file);
};

const executeNextInstruction = () => {
  manual.value = true
  emulator.value.executeNextInstruction()
  scrollToCurrentAddress()

  if (emulator.value.state !== State.RUNNING && canvas.value) {
    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
    draw(canvas.value, ctx);
  }
}

const scrollToCurrentAddress = () => document.getElementsByClassName('current-address')[0].scrollIntoView({
  behavior: 'smooth',
  block: 'center',
})

const isRomLoaded = computed(() => emulator.value.state !== State.OFF)

const animate = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
  if (emulator.value.state === State.ROM_LOADED) {
    emulator.value.run(manual.value)
  }

  if (emulator.value.state === State.RUNNING) {
    requestAnimationFrame(() => {
      ctx.clearRect(0, 0, 64 * 20, 32 * 20)
      draw(canvas, ctx);
      animate(canvas, ctx)
    })
  }
}

const draw = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
  drawScreen(ctx)
  if (showGrid.value) drawGrid(canvas, ctx)
}

const drawScreen = (ctx: CanvasRenderingContext2D) => {
  for (let y = 0; y < 32; ++y) {
    for (let x = 0; x < 64; ++x) {
      ctx.beginPath()
      ctx.fillStyle = emulator.value.graphics.getPixelAt({ x, y }) ? 'white' : 'black'
      ctx.fillRect(x * 20, y * 20, 20, 20)
    }
  }
}

const drawGrid = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
  ctx.strokeStyle = 'rgb(100, 100, 100)'
  ctx.lineWidth = 1

  for (let x = 0; x < canvas.width; x += 20) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, canvas.height)
    ctx.stroke()
  }

  for (let y = 0; y < canvas.height; y += 20) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(canvas.width, y)
    ctx.stroke()
  }
}

const mountKeyboardEvents = () => {
  window.addEventListener('keydown', (event) => {
    if (event.key === '0') {
      emulator.value.input.press(0x0)
    }
    if (event.key === '1') {
      emulator.value.input.press(0x7)
    }
    if (event.key === '2') {
      emulator.value.input.press(0x8)
    }
    if (event.key === '3') {
      emulator.value.input.press(0x9)
    }
    if (event.key === '4') {
      emulator.value.input.press(0x4)
    }
    if (event.key === '5') {
      emulator.value.input.press(0x5)
    }
    if (event.key === '6') {
      emulator.value.input.press(0x6)
    }
    if (event.key === '7') {
      emulator.value.input.press(0x1)
    }
    if (event.key === '8') {
      emulator.value.input.press(0x2)
    }
    if (event.key === '9') {
      emulator.value.input.press(0x3)
    }
    if (event.key === '/') {
      emulator.value.input.press(0xC)
    }
    if (event.key === '*') {
      emulator.value.input.press(0xD)
    }
    if (event.key === '-') {
      emulator.value.input.press(0xE)
    }
    if (event.key === '+') {
      emulator.value.input.press(0xB)
    }
    if (event.key === 'Enter') {
      emulator.value.input.press(0xF)
    }
    if (event.key === ',') {
      emulator.value.input.press(0xA)
    }

  })

  window.addEventListener('keyup', (event) => {
    if (event.key === '0') {
      emulator.value.input.release(0x0)
    }
    if (event.key === '1') {
      emulator.value.input.release(0x7)
    }
    if (event.key === '2') {
      emulator.value.input.release(0x8)
    }
    if (event.key === '3') {
      emulator.value.input.release(0x9)
    }
    if (event.key === '4') {
      emulator.value.input.release(0x4)
    }
    if (event.key === '5') {
      emulator.value.input.release(0x5)
    }
    if (event.key === '6') {
      emulator.value.input.release(0x6)
    }
    if (event.key === '7') {
      emulator.value.input.release(0x1)
    }
    if (event.key === '8') {
      emulator.value.input.release(0x2)
    }
    if (event.key === '9') {
      emulator.value.input.release(0x3)
    }
    if (event.key === '/') {
      emulator.value.input.release(0xC)
    }
    if (event.key === '*') {
      emulator.value.input.release(0xD)
    }
    if (event.key === '-') {
      emulator.value.input.release(0xE)
    }
    if (event.key === '+') {
      emulator.value.input.release(0xB)
    }
    if (event.key === 'Enter') {
      emulator.value.input.release(0xF)
    }
    if (event.key === ',') {
      emulator.value.input.release(0xA)
    }
  })
}

const play = () => {
  emulator.value.state = State.ROM_LOADED
  manual.value = false
  animate(canvas.value!, ctx)
}

const restart = () => {
  if (!loadedRom) return

  emulator.value.loadROM(loadedRom)
}

function convertUint_to_hexStr(uint8: Uint8Array | Uint16Array, join: string = ' ') {
  return Array.from(uint8)
      .map((i) => i.toString(16).padStart(uint8 instanceof Uint8Array ? 2 : 4, '0'))
      .join(join);
}

onMounted(() => {
  if (canvas.value) {
    ctx = canvas.value.getContext("2d")!
    canvas.value.width = 1280
    canvas.value.height = 640

    mountKeyboardEvents()
  }
})

const isCurrentAddress = (index: number) => index === emulator.value.cpu.getCurrentAddress() || index === emulator.value.cpu.getCurrentAddress() + 1
const toHexa = (n: number, pad: number = 2) => {
  return n.toString(16).padStart(pad, '0').toUpperCase()
}
</script>

<template>
  <div class="container">
    <canvas ref="canvas"/>
    <div class="memory">
      <div v-for="(address, index) in emulator.memory.addresses" :key="index" class="address"
           :class="{'current-address': isCurrentAddress(index)}">
        <div class="address-index-hexa">0x{{ toHexa(index, 3) }} ({{ index }})</div>
        <div class="address-value">{{ toHexa(address) }}</div>
      </div>
    </div>
  </div>
  <input type="file" @change="loadFile"/>
  <button :disabled="!isRomLoaded" @click="executeNextInstruction">Next Instruction</button>
  <button :disabled="!isRomLoaded" @click="play">Play</button>
  <button :disabled="!isRomLoaded" @click="restart">Restart</button>
  <button :disabled="!isRomLoaded" @click="emulator.state = State.PAUSED">Pause</button>
  Manual<input type="checkbox" v-model="manual">
  Grid<input type="checkbox" v-model="showGrid">
  PC: {{ emulator.cpu.getCurrentAddress().toString(16).padStart(4, '0') }}
  | I: {{ emulator.registers.getI().toString(16).padStart(4, '0') }}
  | Last OPCODE : {{ emulator.lastOpcode?.toString() }}
  | Regs: {{ convertUint_to_hexStr(emulator.registers.entries(0x0, 0xF)) }}
  | Stack : {{ convertUint_to_hexStr(emulator.stack.slots) }}
  | DelayTimer: {{ emulator.delayTimer.read() }}
  | SoundTimer: {{ emulator.soundTimer.read() }}
  | Input: {{ emulator.input.keys }}
  | AwaitingKey: {{ !!emulator.input.isAwaitingForKey }}

  <br>
  <span v-for="(line, index) in emulator.graphics.pixels" :key="index">
    <span>{{ line }}<br></span>
  </span>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  justify-content: stretch;
  max-width: 100vw;
}

.memory {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
  background-color: green;
  color: white;
  word-wrap: break-word;
  overflow: scroll;
  font-size: 12px;
  max-height: 80vh;
  resize: vertical;
  height: 640px;
}

@media (max-width: 1400px) {
  .container {
    flex-direction: column;
  }

  .memory {
    height: 200px;
  }
}

.current-address {
  background-color: yellow;
  color: black;
  font-weight: bold;
}

.address {
  display: flex;
  flex-direction: column;
}

canvas {
  width: 1280px;
  height: 640px;
}
</style>
