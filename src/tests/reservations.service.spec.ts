import * as reservationService from '../services/reservations.service';
import db from '../db';

describe('Reservation Service', () => {
  beforeAll(async () => {
    await db.migrate.latest();
    await db.seed.run();
  });

  afterAll(async () => {
    await db.destroy();
  });

  it('should fetch paginated reservations sorted by check_in_date in ascending order', async () => {
    jest.setTimeout(10000);
    const reservations = await reservationService.getAllReservations(1, 5, 'check_in_date', 'asc');
    expect(reservations).toHaveLength(5);
    expect(reservations[0].check_in_date.toISOString()).toBe('2025-01-01T00:00:00.000Z'); // Example assertion
  });

  it('should fetch paginated reservations sorted by status in descending order', async () => {
    jest.setTimeout(10000);
    const reservations = await reservationService.getAllReservations(1, 5, 'status', 'desc');
    expect(reservations).toHaveLength(5);
    expect(reservations[0].status).toBe('canceled'); // Example assertion
  });
});
