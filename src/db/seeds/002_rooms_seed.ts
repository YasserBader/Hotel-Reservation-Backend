import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex('rooms').del(); // Clear existing data
  await knex('rooms').insert([
    { room_number: '101', room_name: 'Standard Room' },
    { room_number: '102', room_name: 'Deluxe Room' },
    { room_number: '103', room_name: 'Suite Room' },
    { room_number: '104', room_name: 'Family Room' },
    { room_number: '105', room_name: 'Presidential Suite' },
    { room_number: '106', room_name: 'Studio Apartment' },
    { room_number: '107', room_name: 'Penthouse' },
    { room_number: '108', room_name: 'Business Suite' },
    { room_number: '109', room_name: 'Economy Room' },
    { room_number: '110', room_name: 'Superior Room' },
  ]);
}
