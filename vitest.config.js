import {defineConfig} from 'vitest/config'

export default defineConfig({
    test: {
        coverage: {
            include: ['**/src/**'],
            exclude: ['app/**'],
        },
        isolate: false,
        setupFiles: ['./test.setup.js'],
    },
})