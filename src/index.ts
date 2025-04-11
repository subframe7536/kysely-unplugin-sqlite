import type { TransformOptions } from './types'

import { createUnplugin } from 'unplugin'

import { transformKyselyCode } from './transform'

export type { TransformOptions } from './types'

/**
 * Unplugin for Kysely and SQLite, trim kysely private properties and remove unsupported or unused methods
 *
 * Transform kysely esm code by default
 *
 * removed methods:
 * - `mergeInto`
 * - `replaceInto`
 * - `top`
 * - `fetch`
 * - `ignore`
 * @example
 * import { defineConfig } from 'vite'
 * import { plugin } from 'kysely-unplugin-sqlite'
 *
 * export default defineConfig({
 *   plugins: [plugin.vite({ dropMigrator: true })],
 * })
 */
export const plugin = createUnplugin<TransformOptions | undefined>(
  (options = {}) => {
    const { filter = /(?=.*kysely)(?=.*esm).+/, useDynamicTransformer = true, ...rest } = options
    return {
      name: 'unplugin-kysely',
      transform: {
        filter: {
          id: filter,
        },
        handler(code, id) {
          return transformKyselyCode(code, id, { useDynamicTransformer, ...rest })
        },
      },
    }
  },
)
