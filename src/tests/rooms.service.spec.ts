import db from '../db';
import * as roomService from '../services/rooms.service';

describe('Room Service', () => {
  beforeAll(async () => {
    await db.migrate.latest();
    await db.seed.run();
  });

  afterAll(async () => {
    await db.destroy();
  });

  it('should fetch paginated rooms sorted by room_name in ascending order', async () => {
    const rooms = await roomService.getAllRooms(1, 5, 'room_name', 'asc');
    expect(rooms).toHaveLength(5);
    expect(rooms[0].room_name).toBe('Business Suite');
  });

  it('should fetch paginated rooms sorted by room_number in descending order', async () => {
    const rooms = await roomService.getAllRooms(1, 5, 'room_number', 'desc');
    expect(rooms).toHaveLength(5);
    expect(rooms[0].room_number).toBe('110');
  });
});
