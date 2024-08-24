import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['./src/index.ts'],
  clean: true,
  external: ['unplugin'],
  format: ['cjs', 'esm'],
  dts: true,
  treeshake: true,
})
