import db from '../db';

export const getAllGuests = async (page: number, limit: number, sortBy = 'guest_id', order = 'asc') => {
  const offset = (page - 1) * limit;
  return db('guests').select('*').orderBy(sortBy, order).limit(limit).offset(offset);
};

export const getTotalPastReservations = async (guestId: number) => {
  return db('reservations')
    .where('guest_id', guestId)
    .andWhere('check_out_date', '<', db.fn.now())
    .count('* as total')
    .first();
};

export const getGuestById = async (id: number) => {
  const guest = await db('guests').where({ guest_id: id }).first();
  const totalReservations = await getTotalPastReservations(id);
  return { ...guest, totalPastReservations: totalReservations?.total || 0 };
};
export const createGuest = async (data: any) => {
  return db('guests').insert(data).returning('*');
};

export const updateGuest = async (id: number, data: any) => {
  return db('guests').where({ guest_id: id }).update(data).returning('*');
};
