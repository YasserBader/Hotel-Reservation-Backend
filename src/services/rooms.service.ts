import db from '../db';

export const getAllRooms = async (page: number, limit: number, sortBy = 'room_id', order = 'asc') => {
  const offset = (page - 1) * limit;
  return db('rooms').select('*').orderBy(sortBy, order).limit(limit).offset(offset);
};

export const getRoomById = async (id: number) => {
  return db('rooms').where({ room_id: id }).first();
};

export const createRoom = async (data: any) => {
  return db('rooms').insert(data).returning('*');
};

export const updateRoom = async (id: number, data: any) => {
  return db('rooms').where({ room_id: id }).update(data).returning('*');
};

export const getRoomWithReservations = async (roomId: number) => {
  const room = await db('rooms').where({ room_id: roomId }).first();
  const reservations = await db('reservations')
    .where('room_id', roomId)
    .andWhere('check_out_date', '>=', db.fn.now())
    .orderBy('check_in_date', 'asc');
  return { ...room, reservations };
};
