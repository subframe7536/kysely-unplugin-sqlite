# kysely-unplugin-sqlite

Unplugin for Kysely and SQLite to optimize bundled size

Trim kysely private properties and remove unsupported or unused methods

Transform kysely esm code by default

removed methods:
- `mergeInto`
- `replaceInto`
- `top`
- `fetch`
- `ignore`

About 20% of the minified bundle size is reduced by default, up to **60%** when enable all options.

**use at your own risk!**

## Get Started

### Install

```sh
npm install kysely-unplugin
```
```sh
yarn add kysely-unplugin
```
```sh
pnpm add kysely-unplugin
```

You should also install `kysely`, `unplugin` and `magic-string` in your project (Auto installed by peerDependencies).

### Usage

```ts
import { defineConfig } from 'vite'
import { plugin } from 'kysely-sqlite-builder/plugin'

export default defineConfig({
  plugins: [plugin.vite({ dropMigrator: true })],
})
```

### types

```ts
export type TransformOptions = {
  /**
   * Filter files to be transformed
   * @param filePath file path
   */
  filter?: (filePath: string) => boolean
  /**
   * Custom extra transformer
   * @param code source code
   * @param filePath file path
   */
  transform?: (code: MagicString, filePath: string) => MagicString
  /**
   * Use dynamic node transformer in `DefaultQueryCompiler`
   * @default true
   */
  useDynamicTransformer?: boolean
  /**
   * Drop support of `migrator`, `instropection`, and remove all props in `adapter` except `supportsReturning: true`
   *
   * If you are using `defineTable`, recommend to set `true`
   */
  dropMigrator?: boolean
  /**
   * Drop support of `schema` and table management
   *
   * If you are using `defineTable`, recommend to set `true`
   */
  dropSchema?: boolean
  /**
   * Drop support of `delete`
   *
   * If you are using `createSoftDeleteExecutor`, recommend to set `true`
   */
  dropDelete?: boolean
  /**
   * Minify method name
   *
   * method names:
   * - `append -> _a`
   * - `cloneWith -> _clw`
   * - `create -> _c`
   * - `createWith -> _crw`
   * - `Wrapper -> _W`
   * - `visit -> _v`
   * - `toOperationNode` -> `_ton`
   * - `executor` -> `_ec`
   */
  minifyMethodName?: boolean
}
```

## Example

Build with `tsup` and setup `plugin.esbuild()`

See in [/example](./example/)

```ts
import { Kysely, sql } from 'kysely'
import { EmptyDialect } from 'kysely-wasm'

const db = new Kysely<{ test: { test: number } }>({
  dialect: new EmptyDialect(),
})

export function test(): Promise<unknown> {
  return sql`select 1`.execute(db)
}

console.log(db.insertInto('test').values({ test: 1 }).compile().sql)
```

### Build Result

| Option                     | Size      | Minified Size |
| -------------------------- | --------- | ------------- |
| no plugin                  | 344.13 KB | 131.26 KB     |
| with plugin                | 296.41 KB | 111.09 KB     |
| with plugin of all options | 171.20 KB | 56.74 KB      |

## License

MIT
