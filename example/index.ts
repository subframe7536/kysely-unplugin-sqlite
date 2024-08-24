import { Kysely, sql } from 'kysely'
import { EmptyDialect } from 'kysely-wasm'

const db = new Kysely<{ test: { test: number } }>({
  dialect: new EmptyDialect(),
})

export function test(): Promise<unknown> {
  return sql`select 1`.execute(db)
}

console.log(db.insertInto('test').values({ test: 1 }).compile().sql)
