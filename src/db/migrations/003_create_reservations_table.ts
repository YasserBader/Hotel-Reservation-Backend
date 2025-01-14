import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('reservations', (table) => {
    table.increments('reservation_id').primary();
    table.integer('room_id').unsigned().references('room_id').inTable('rooms').onDelete('CASCADE');
    table.integer('guest_id').unsigned().references('guest_id').inTable('guests').onDelete('CASCADE');
    table.date('check_in_date').notNullable();
    table.date('check_out_date').notNullable();
    table.string('status', 20).defaultTo('active');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('reservations');
}
