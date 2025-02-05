import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
    build: {
        lib: {
            entry: [ resolve(__dirname, 'src/index.ts') ],
            formats: [ 'es', 'umd' ],
            name: 'chip8',
            fileName: (format) => `math-operations.${ format }.js`
        },
    },
    resolve: {
        alias: {
            '@': resolve('/'),
            'src': resolve('src/'),
            '@mawsfr/math-operations': resolve('packages/math-operations/src/'),
        }
    },
    plugins: [
        dts({
            outDir: 'dist/types',
            rollupTypes: true,
            tsconfigPath: "./tsconfig.json"
        })
    ],
})
