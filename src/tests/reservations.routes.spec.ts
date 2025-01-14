import request from 'supertest';
import app from '../app';
import db from '../db';

beforeAll(async () => {
  await db.migrate.latest();
  await db.seed.run();
});

afterAll(async () => {
  await db.destroy();
});

describe('Reservation Routes', () => {
  it('should fetch all reservations', async () => {
    const response = await request(app).get('/api/reservations?page=1&limit=5');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(5);
  });

  it('should create a new reservation', async () => {
    const response = await request(app).post('/api/reservations').send({
      guest_id: 1,
      room_id: 1,
      check_in_date: '2025-01-01',
      check_out_date: '2025-01-07',
    });
    expect(response.status).toBe(201);
    expect(response.body.guest_id).toBe(1);
    expect(response.body.room_id).toBe(1);
  });

  it('should return conflict for overlapping reservations', async () => {
    const response = await request(app).post('/api/reservations').send({
      guest_id: 2,
      room_id: 1,
      check_in_date: '2025-01-05',
      check_out_date: '2025-01-10',
    });
    expect(response.status).toBe(409);
    expect(response.body.error).toBe('Room is already booked for the selected dates');
  });
});
