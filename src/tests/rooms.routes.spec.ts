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

describe('Room Routes', () => {
  it('should fetch all rooms', async () => {
    const response = await request(app).get('/api/rooms?page=1&limit=5');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(5);
  });

  it('should create a new room', async () => {
    const response = await request(app).post('/api/rooms').send({
      room_number: '202',
      room_name: 'Test Room',
    });
    expect(response.status).toBe(201);
    expect(response.body.room_number).toBe('202');
  });

  it('should return validation error for invalid room data', async () => {
    const response = await request(app).post('/api/rooms').send({
      room_number: '',
      room_name: '',
    });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid room data');
  });
});
