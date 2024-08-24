import { readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { build } from 'tsup'
import type { TransformOptions } from '../src/index'
import { plugin } from '../src/index'

const base = 'dist-test'
async function buildAndTest(minify: boolean, options?: TransformOptions): Promise<string> {
  await build({
    entry: ['example/index.ts'],
    outDir: base,
    noExternal: ['kysely', 'kysely-wasm'],
    minify,
    esbuildPlugins: options && [plugin.esbuild(options)],
    dts: false,
    format: 'cjs',
    silent: true,
  })
  const { size } = statSync(base + '/index.cjs')
  rmSync(base, { recursive: true, force: true })
  return (size / 1024).toFixed(2)
}

const pluginOptions: TransformOptions = {
  dropMigrator: true,
  dropSchema: true,
  dropDelete: true,
  minifyMethodName: true,
}

const result = {
  minify: await buildAndTest(true),
  noMinify: await buildAndTest(false),
  minifyWithPlugin: await buildAndTest(true, {}),
  noMinifyWithPlugin: await buildAndTest(false, {}),
  minifyWithPluginAll: await buildAndTest(true, pluginOptions),
  noMinifyWithPluginAll: await buildAndTest(false, pluginOptions),
}

const output = `
| Option                     | Size      | Minified Size |
| -------------------------- | --------- | ------------- |
| no plugin                  | ${result.noMinify} KB | ${result.minify} KB     |
| with plugin                | ${result.noMinifyWithPlugin} KB | ${result.minifyWithPlugin} KB     |
| with plugin of all options | ${result.noMinifyWithPluginAll} KB | ${result.minifyWithPluginAll} KB      |
`

console.log(output)

const readme = readFileSync('README.md', 'utf-8')

writeFileSync(
  'README.md',
  readme.replace(
    /### Build Result[\s\S]*## License/,
    `### Build Result\n${output}\n## License`,
  ),
)
