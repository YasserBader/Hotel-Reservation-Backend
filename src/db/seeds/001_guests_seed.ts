import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex('guests').del(); // Clear existing data
  await knex('guests').insert([
    { name: 'John Doe', email: 'john@example.com', phone_number: '1234567890' },
    { name: 'Jane Smith', email: 'jane@example.com', phone_number: '0987654321' },
    { name: 'Alice Johnson', email: 'alice@example.com', phone_number: '2345678901' },
    { name: 'Bob Brown', email: 'bob@example.com', phone_number: '3456789012' },
    { name: 'Charlie Davis', email: 'charlie@example.com', phone_number: '4567890123' },
    { name: 'Diana Evans', email: 'diana@example.com', phone_number: '5678901234' },
    { name: 'Eve Ford', email: 'eve@example.com', phone_number: '6789012345' },
    { name: 'Frank Green', email: 'frank@example.com', phone_number: '7890123456' },
    { name: 'Grace Hall', email: 'grace@example.com', phone_number: '8901234567' },
    { name: 'Hank Ives', email: 'hank@example.com', phone_number: '9012345678' },
  ]);
}
