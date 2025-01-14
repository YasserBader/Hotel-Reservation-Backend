import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex('reservations').del(); // Clear existing data
  const guests = await knex('guests').select('guest_id');
  const rooms = await knex('rooms').select('room_id');

  const guestIds = guests.map((guest) => guest.guest_id);
  const roomIds = rooms.map((room) => room.room_id);
  await knex('reservations').insert([
    {
      room_id: roomIds[0],
      guest_id: guestIds[0],
      check_in_date: '2025-01-01',
      check_out_date: '2025-01-07',
      status: 'active',
    },
    {
      room_id: roomIds[1],
      guest_id: guestIds[1],
      check_in_date: '2025-01-05',
      check_out_date: '2025-01-10',
      status: 'active',
    },
    {
      room_id: roomIds[2],
      guest_id: guestIds[2],
      check_in_date: '2025-01-10',
      check_out_date: '2025-01-15',
      status: 'active',
    },
    {
      room_id: roomIds[3],
      guest_id: guestIds[3],
      check_in_date: '2025-01-15',
      check_out_date: '2025-01-20',
      status: 'canceled',
    },
    {
      room_id: roomIds[4],
      guest_id: guestIds[4],
      check_in_date: '2025-01-20',
      check_out_date: '2025-01-25',
      status: 'active',
    },
    {
      room_id: roomIds[5],
      guest_id: guestIds[5],
      check_in_date: '2025-01-25',
      check_out_date: '2025-01-30',
      status: 'active',
    },
    {
      room_id: roomIds[6],
      guest_id: guestIds[6],
      check_in_date: '2025-02-01',
      check_out_date: '2025-02-05',
      status: 'active',
    },
    {
      room_id: roomIds[7],
      guest_id: guestIds[7],
      check_in_date: '2025-02-05',
      check_out_date: '2025-02-10',
      status: 'canceled',
    },
    {
      room_id: roomIds[8],
      guest_id: guestIds[8],
      check_in_date: '2025-02-10',
      check_out_date: '2025-02-15',
      status: 'active',
    },
    {
      room_id: roomIds[9],
      guest_id: guestIds[9],
      check_in_date: '2025-02-15',
      check_out_date: '2025-02-20',
      status: 'active',
    },
    {
      room_id: roomIds[1],
      guest_id: guestIds[2],
      check_in_date: '2025-02-21',
      check_out_date: '2025-02-25',
      status: 'active',
    },
    {
      room_id: roomIds[4],
      guest_id: guestIds[5],
      check_in_date: '2025-03-01',
      check_out_date: '2025-03-05',
      status: 'canceled',
    },
    {
      room_id: roomIds[7],
      guest_id: guestIds[3],
      check_in_date: '2025-03-10',
      check_out_date: '2025-03-15',
      status: 'active',
    },
    {
      room_id: roomIds[3],
      guest_id: guestIds[6],
      check_in_date: '2025-03-15',
      check_out_date: '2025-03-20',
      status: 'active',
    },
    {
      room_id: roomIds[8],
      guest_id: guestIds[0],
      check_in_date: '2025-03-20',
      check_out_date: '2025-03-25',
      status: 'active',
    },
  ]);
}
