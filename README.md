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
npm install kysely-unplugin-sqlite
```
```sh
yarn add kysely-unplugin-sqlite
```
```sh
pnpm add kysely-unplugin-sqlite
```

You should also install `kysely`, `unplugin` and `magic-string` in your project (Auto installed by peerDependencies).

### Usage

```ts
import { plugin } from 'kysely-unplugin-sqlite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [plugin.vite({ dropMigrator: true })],
})
```

### types

```ts
export type TransformOptions = {
  /**
   * Filter files to be transformed
   * @default /(?=.*kysely)(?=.*esm).+/
   */
  filter?: StringFilter
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
   */
  dropMigrator?: boolean
  /**
   * Drop support of `schema`, `withSchema` and table management
   */
  dropSchema?: boolean
  /**
   * Drop support of `delete`
   */
  dropDelete?: boolean
  /**
   * Drop support of `replace into`
   */
  dropReplace?: boolean
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

### Recommended

If just need a query builder, it is recommended to just use
```ts
const options = {
  dropMigrator: true,
  dropSchema: true,
  minifyMethodName: true,
}
```

## Example

Build with `tsup` and setup `plugin.esbuild()`

See in [example/](./example/)

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
| with plugin                | 296.58 KB | 111.16 KB     |
| with plugin of recommended | 184.67 KB |  59.34 KB     |
| with plugin of all options | 168.67 KB |  55.49 KB     |

Trim **57.73%** at most

## License

MIT
