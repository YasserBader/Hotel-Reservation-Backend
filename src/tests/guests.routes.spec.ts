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

describe('Guest Routes', () => {
  it('should fetch all guests', async () => {
    const response = await request(app).get('/api/guests?page=1&limit=5');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(5);
  });

  it('should create a new guest', async () => {
    const response = await request(app).post('/api/guests').send({
      name: 'New Guest',
      email: 'newguest@example.com',
      phone_number: '1234567890',
    });
    expect(response.status).toBe(201);
    expect(response.body.name).toBe('New Guest');
  });

  it('should return validation error for invalid guest data', async () => {
    const response = await request(app).post('/api/guests').send({
      name: '',
      email: 'invalid-email',
      phone_number: '',
    });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid guest data');
  });
});
