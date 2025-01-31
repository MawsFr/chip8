<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef } from "vue";
import { Emulator, State } from '../domain/emulator.ts'
import { Graphics } from "../domain/graphics.ts";
import Stack from "../domain/stack.ts";
import Registers from "../domain/registers.ts";
import Memory from "../domain/memory.ts";
import { Input } from "../domain/input.ts";
import { Timer } from "../domain/timers.ts";
import { Cpu } from "../domain/cpu.ts";

const canvas = useTemplateRef('canvas')
const memoryDiv = useTemplateRef('memoryDiv')
let ctx: CanvasRenderingContext2D;

const graphics = new Graphics()
const stack = new Stack()
const registers = new Registers()
const memory = new Memory(registers)
const input = new Input()
const delayTimer = new Timer()
const soundTimer = new Timer()
const cpu = new Cpu(graphics, stack, registers, memory, input, delayTimer, soundTimer)
const emulator = ref(new Emulator(cpu, graphics, stack, registers, memory, input, delayTimer, soundTimer))
const manual = ref(false)
const showGrid = ref(false)
let loadedRom: Uint8Array | null = null

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget
}

const loadFile = (event: HTMLInputEvent) => {
  const file = event.target?.files?.[0];
  if (!file) {
    console.error("Aucun fichier sélectionné.");
    return;
  }

  const reader = new FileReader();
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
      ctx.fillStyle = graphics.getPixelAt({ x, y }) ? 'white' : 'black'
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
      input.press(0x0)
    }
    if (event.key === '1') {
      input.press(0x7)
    }
    if (event.key === '2') {
      input.press(0x8)
    }
    if (event.key === '3') {
      input.press(0x9)
    }
    if (event.key === '4') {
      input.press(0x4)
    }
    if (event.key === '5') {
      input.press(0x5)
    }
    if (event.key === '6') {
      input.press(0x6)
    }
    if (event.key === '7') {
      input.press(0x1)
    }
    if (event.key === '8') {
      input.press(0x2)
    }
    if (event.key === '9') {
      input.press(0x3)
    }
    if (event.key === '/') {
      input.press(0xC)
    }
    if (event.key === '*') {
      input.press(0xD)
    }
    if (event.key === '-') {
      input.press(0xE)
    }
    if (event.key === '+') {
      input.press(0xB)
    }
    if (event.key === 'Enter') {
      input.press(0xF)
    }
    if (event.key === ',') {
      input.press(0xA)
    }

  })

  window.addEventListener('keyup', (event) => {
    if (event.key === '0') {
      input.release(0x0)
    }
    if (event.key === '1') {
      input.release(0x7)
    }
    if (event.key === '2') {
      input.release(0x8)
    }
    if (event.key === '3') {
      input.release(0x9)
    }
    if (event.key === '4') {
      input.release(0x4)
    }
    if (event.key === '5') {
      input.release(0x5)
    }
    if (event.key === '6') {
      input.release(0x6)
    }
    if (event.key === '7') {
      input.release(0x1)
    }
    if (event.key === '8') {
      input.release(0x2)
    }
    if (event.key === '9') {
      input.release(0x3)
    }
    if (event.key === '/') {
      input.release(0xC)
    }
    if (event.key === '*') {
      input.release(0xD)
    }
    if (event.key === '-') {
      input.release(0xE)
    }
    if (event.key === '+') {
      input.release(0xB)
    }
    if (event.key === 'Enter') {
      input.release(0xF)
    }
    if (event.key === ',') {
      input.release(0xA)
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

const isCurrentAddress = (index: number) => index === cpu.getProgramCounter() || index === cpu.getProgramCounter() + 1
const toHexa = (n: number, pad: number = 2) => {
  return n.toString(16).padStart(pad, '0').toUpperCase()
}
</script>

<template>
  <div class="container">
    <canvas ref="canvas"/>
    <div ref="memoryDiv" class="memory">
      <div v-for="(address, index) in memory.addresses" :key="index" class="address"
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
  PC: {{ emulator.cpu.getProgramCounter().toString(16).padStart(4, '0') }}
  | I: {{ emulator.registers.getI().toString(16).padStart(4, '0') }}
  | Last OPCODE : {{ emulator.lastOpcode.toString(16).padStart(4, '0') }}
  | Regs: {{ convertUint_to_hexStr(emulator.registers.getRange(0x0, 0xF)) }}
  | Stack : {{ convertUint_to_hexStr(emulator.stack.slots) }}
  | DelayTimer: {{ emulator.delayTimer.read() }}
  | SoundTimer: {{ emulator.soundTimer.read() }}
  | Input: {{ emulator.input.keys }}
  | AwaitingKey: {{ !!emulator.input.resolveKey }}

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
  background-color: red;
  color: white;
  word-wrap: break-word;
  overflow: scroll;
  font-size: 12px;
  max-height: 80vh;
  resize: vertical;
  height: 640px;
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
