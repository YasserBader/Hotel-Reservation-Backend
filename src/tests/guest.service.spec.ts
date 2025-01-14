import * as guestService from '../services/guest.service';
import db from '../db';

describe('Guest Service', () => {
  beforeAll(async () => {
    await db.migrate.latest();
    await db.seed.run();
  });

  afterAll(async () => {
    await db.destroy();
  });

  it('should fetch paginated guests sorted by name in descending order', async () => {
    jest.setTimeout(10000);
    const guests = await guestService.getAllGuests(1, 5, 'name', 'desc');
    expect(guests).toHaveLength(5);
    expect(guests[0].name).toBe('John Doe'); // Example assertion
  });

  it('should fetch paginated guests sorted by email in ascending order', async () => {
    jest.setTimeout(10000);
    const guests = await guestService.getAllGuests(1, 5, 'email', 'asc');
    expect(guests).toHaveLength(5);
    expect(guests[0].email).toBe('alice@example.com'); // Example assertion
  });
});
