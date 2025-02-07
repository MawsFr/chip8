import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
    "./packages/math-operations/vitest.config.ts",
    "./packages/use-chip8-emulator/vitest.config.ts",
    "./packages/binary-operations/vitest.config.ts",
    "./packages/chip8/vitest.config.ts",
    "./app/vitest.config.ts",
    "./vitest.config.js"
])
