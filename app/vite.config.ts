import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
    plugins: [ vue() ],
    base: "/chip8/",
    build: {
        outDir: "dist"
    },
    resolve: {
        alias: {
            '@': resolve('/'),
            'src': resolve('src/'),
            '@mawsfr/chip8': resolve('../packages/chip8/src/'),
            '@mawsfr/binary-operations': resolve('../packages/binary-operations/src/'),
            '@mawsfr/math-operations': resolve('../packages/math-operations/src/'),
            '@mawsfr/use-chip8-emulator': resolve('../packages/use-chip8-emulator/src/'),
        }
    },
});
