import type MagicString from 'magic-string'
import type { StringFilter } from 'unplugin'

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
   * Minify method name, maybe you should also setup `filter`
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
