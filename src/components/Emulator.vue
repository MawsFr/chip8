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

const graphics = ref<Graphics>(new Graphics())
const stack = ref(new Stack())
const registers = ref(new Registers())
const memory = ref(new Memory(registers.value))
const input = ref(new Input())
const delayTimer = ref(new Timer())
const soundTimer = ref(new Timer())
const cpu = ref(new Cpu(graphics.value, stack.value, registers.value, memory.value, input.value, delayTimer.value, soundTimer.value))
const emulator = ref(new Emulator(cpu.value, graphics.value, stack.value, registers.value, memory.value, input.value, delayTimer.value, soundTimer.value))
const manual = ref(true)
const showGrid = ref(false)

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
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    draw(canvas, ctx);
    requestAnimationFrame(() => animate(canvas, ctx))
  }

}

const draw = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
  drawScreen(canvas, ctx)
  if (showGrid.value) drawGrid(canvas, ctx)
}

const drawScreen = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
  for (let y = 0; y < 32; ++y) {
    for (let x = 0; x < 64; ++x) {
      ctx.beginPath()
      ctx.fillStyle = graphics.value.getPixelAt(x + y * 64) ? 'white' : 'black'
      ctx.fillRect(x * 20, y * 20, 20, 20)
    }
  }
}

const drawGrid = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
  ctx.strokeStyle = 'red'
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

const play = () => {
  emulator.value.state = State.ROM_LOADED
  manual.value = false
  animate(canvas.value!, ctx)
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
  }
})

const isCurrentAddress = (index: number) => index === cpu.value.getProgramCounter() || index === cpu.value.getProgramCounter() + 1
const toHexa = (n: number) => {
  return n.toString(16).padStart(2, '0')
}
</script>

<template>
  <div class="container">
    <canvas ref="canvas"/>
    <div ref="memoryDiv" class="memory">
      <div v-for="(address, index) in memory.addresses" :key="index" class="address"
           :class="{'current-address': isCurrentAddress(index)}">{{ toHexa(address) }}
      </div>
    </div>
  </div>
  <input type="file" @change="loadFile"/>
  <button :disabled="!isRomLoaded" @click="executeNextInstruction">Next Instruction</button>
  <button :disabled="!isRomLoaded" @click="emulator.state = State.STOPPED">Stop</button>
  <button :disabled="!isRomLoaded" @click="play">Play</button>
  Manual<input type="checkbox" v-model="manual">
  Grid<input type="checkbox" v-model="showGrid">
  PC: {{ cpu.getProgramCounter().toString(16).padStart(4, '0') }}
  | I: {{ registers.getI().toString(16).padStart(4, '0') }}
  | Last OPCODE : {{ emulator.lastOpcode.toString(16).padStart(4, '0') }}
  | Regs: {{ convertUint_to_hexStr(registers.getRange(0x0, 0xF)) }}
  | Stack : {{ convertUint_to_hexStr(stack.slots) }}
  | DelayTimer: {{ delayTimer.read() }}
  | SoundTimer: {{ soundTimer.read() }}


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

canvas {
  width: 1280px;
  height: 640px;
}
</style>
