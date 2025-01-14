import db from '../db';

export const getAllReservations = async (page: number, limit: number, sortBy = 'reservation_id', order = 'asc') => {
  const offset = (page - 1) * limit;
  return db('reservations').select('*').orderBy(sortBy, order).limit(limit).offset(offset);
};

export const getReservationById = async (id: number) => {
  return db('reservations').where({ reservation_id: id }).first();
};

export const createReservation = async (data: any) => {
  return db('reservations').insert(data).returning('*');
};

export const updateReservation = async (id: number, data: any) => {
  return db('reservations').where({ reservation_id: id }).update(data).returning('*');
};

export const cancelReservation = async (id: number) => {
  return db('reservations').where({ reservation_id: id }).del();
};

export const getReservationsByMonth = async (year: number, month: number) => {
  const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
  const endDate = `${year}-${(month + 1).toString().padStart(2, '0')}-01`;

  const reservations = await db('reservations')
    .where('check_in_date', '<', endDate)
    .andWhere('check_out_date', '>=', startDate)
    .select('check_in_date', 'check_out_date');

  // Calculate busy days
  const busyDays: { [key: string]: number } = {};
  reservations.forEach(({ check_in_date, check_out_date }) => {
    let currentDate = new Date(check_in_date);
    const end = new Date(check_out_date);
    while (currentDate <= end) {
      const dateKey = currentDate.toISOString().split('T')[0];
      busyDays[dateKey] = (busyDays[dateKey] || 0) + 1;
      currentDate.setDate(currentDate.getDate() + 1);
    }
  });

  return busyDays;
};
