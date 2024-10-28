import { readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { build } from 'tsup'
import { plugin } from '../src/index'
import type { TransformOptions } from '../src/index'

function findTopOccurrenceSubstrings(s: string, topN: number = 20): any {
  const substrings = s.split(/[\s=\p{P}]+/u).filter(str => str.length > 0)

  const scores = new Map<string, number>()
  for (const substr of substrings) {
    const score = substr.length * substrings.filter(str => str === substr).length
    scores.set(substr, score)
  }

  return Object.fromEntries(
    Array.from(scores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, topN),
  )
}

const base = 'dist-test'
async function buildAndTest(minify: boolean, options?: TransformOptions): Promise<string> {
  const outDir = base + (minify ? '-minify' : '')
  await build({
    entry: ['example/index.ts'],
    outDir,
    noExternal: ['kysely', 'kysely-wasm'],
    minify,
    esbuildPlugins: options && [plugin.esbuild(options)],
    dts: false,
    format: 'cjs',
    silent: true,
  })
  const targetPath = outDir + '/index.cjs'
  if (minify && options?.dropDelete) {
    console.log('keyword x length rank:')
    console.table(findTopOccurrenceSubstrings(readFileSync(targetPath, 'utf8')))
  }
  const { size } = statSync(targetPath)
  if (process.argv.includes('--clean')) {
    rmSync(outDir, { recursive: true, force: true })
  }

  return (size / 1024).toFixed(2)
}

const pluginWithDeleteOptions: TransformOptions = {
  dropMigrator: true,
  dropSchema: true,
  dropReplace: true,
  minifyMethodName: true,
}
const pluginOptions: TransformOptions = {
  ...pluginWithDeleteOptions,
  dropDelete: true,
}

const result = {
  minify: await buildAndTest(true),
  noMinify: await buildAndTest(false),
  minifyWithPlugin: await buildAndTest(true, {}),
  noMinifyWithPlugin: await buildAndTest(false, {}),
  minifyWithDelete: await buildAndTest(true, pluginWithDeleteOptions),
  noMinifyWithDelete: await buildAndTest(false, pluginWithDeleteOptions),
  minifyWithPluginAll: await buildAndTest(true, pluginOptions),
  noMinifyWithPluginAll: await buildAndTest(false, pluginOptions),
}

const percent = ((+result.minify - +result.minifyWithPluginAll) / +result.minify * 100).toFixed(2)
const output = `
| Option                     | Size      | Minified Size |
| -------------------------- | --------- | ------------- |
| no plugin                  | ${result.noMinify} KB | ${result.minify} KB     |
| with plugin                | ${result.noMinifyWithPlugin} KB | ${result.minifyWithPlugin} KB     |
| with plugin of recommended | ${result.noMinifyWithDelete} KB |  ${result.minifyWithDelete} KB     |
| with plugin of all options | ${result.noMinifyWithPluginAll} KB |  ${result.minifyWithPluginAll} KB     |

Trim **${percent}%** at most
`

console.log(output)

if (!process.argv.includes('--dry')) {
  const readme = readFileSync('README.md', 'utf-8')

  writeFileSync(
    'README.md',
    readme.replace(
      /### Build Result[\s\S]*## License/,
      `### Build Result\n${output}\n## License`,
    ),
  )
}
