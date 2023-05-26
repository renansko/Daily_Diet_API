import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('diet', (table) => {
    table.uuid('userId').unsigned().notNullable()
    table.foreign('userId').references('id').inTable('users')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('diet', (table) => {
    table.dropColumn('userId')
  })
}
