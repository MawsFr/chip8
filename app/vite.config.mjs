/// <reference types="vitest/config" />
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue()],
    test: {
        globals: true,
        coverage: {
            enabled: true,
            reporter: 'html'
        },
        isolate: false,
        setupFiles: ['./test.setup.js']
    }
})
