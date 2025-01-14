import { Type, Static } from '@sinclair/typebox';
import Ajv from 'ajv';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import db from '../db';
import addFormats from 'ajv-formats';

// Define schemas
export const GuestSchema = Type.Object({
  name: Type.String(),
  email: Type.String({ format: 'email' }),
  phone_number: Type.String(),
});
export type GuestInput = Static<typeof GuestSchema>;

export const RoomSchema = Type.Object({
  room_number: Type.String(),
  room_name: Type.String(),
});
export type RoomInput = Static<typeof RoomSchema>;

export const ReservationSchema = Type.Object({
  guest_id: Type.Number(),
  room_id: Type.Number(),
  check_in_date: Type.String({ format: 'date' }),
  check_out_date: Type.String({ format: 'date' }),
});
export type ReservationInput = Static<typeof ReservationSchema>;

// Create Ajv instance
const ajv = new Ajv();
addFormats(ajv);
// Compile schemas
const validateGuest = ajv.compile(GuestSchema);
const validateRoom = ajv.compile(RoomSchema);
const validateReservation = ajv.compile(ReservationSchema);

// Validation middleware
export const validateGuestMiddleware: RequestHandler = (req, res, next) => {
  if (!validateGuest(req.body)) {
    res.status(400).json({ error: 'Invalid guest data' });
    return;
  }
  next();
};

export const validateRoomMiddleware: RequestHandler = (req, res, next) => {
  if (!validateRoom(req.body)) {
    res.status(400).json({ error: 'Invalid room data' });
    return;
  }
  next();
};

export const validateReservationMiddleware: RequestHandler = async (req, res, next) => {
  if (!validateReservation(req.body)) {
    res.status(400).json({ error: 'Invalid reservation data' });
    return;
  }

  const { guest_id, room_id, check_in_date, check_out_date } = req.body;

  // Check if guest exists
  const guestExists = await db('guests').where({ guest_id }).first();
  if (!guestExists) {
    res.status(404).json({ error: 'Guest does not exist' });
    return;
  }

  // Check if room exists
  const roomExists = await db('rooms').where({ room_id }).first();
  if (!roomExists) {
    res.status(404).json({ error: 'Room does not exist' });
    return;
  }

  // Check for conflicting reservations
  const conflictingReservation = await db('reservations')
    .where({ room_id })
    .andWhere('check_in_date', '<', check_out_date)
    .andWhere('check_out_date', '>', check_in_date)
    .first();

  if (conflictingReservation) {
    res.status(409).json({ error: 'Room is already booked for the selected dates' });
    return;
  }

  next();
};
