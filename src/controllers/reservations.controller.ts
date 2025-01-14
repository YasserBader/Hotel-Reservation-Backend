import { Request, Response } from 'express';
import * as reservationService from '../services/reservations.service';
import { getReservationsByMonth } from '../services/reservations.service';

export const getAllReservations = async (req: Request, res: Response) => {
  const { page = 1, limit = 10 } = req.query;
  const reservations = await reservationService.getAllReservations(Number(page), Number(limit));
  res.json(reservations);
};

export const getReservationById = async (req: Request, res: Response) => {
  const reservation = await reservationService.getReservationById(Number(req.params.id));
  res.json(reservation);
};

export const createReservation = async (req: Request, res: Response) => {
  const reservation = await reservationService.createReservation(req.body);
  res.status(201).json(reservation);
};

export const updateReservation = async (req: Request, res: Response) => {
  const updatedReservation = await reservationService.updateReservation(Number(req.params.id), req.body);
  res.json(updatedReservation);
};

export const cancelReservation = async (req: Request, res: Response) => {
  await reservationService.cancelReservation(Number(req.params.id));
  res.status(204).send();
};

export const getReservationsCalendar = async (req: Request, res: Response) => {
  const { year, month } = req.query;
  const busyDays = await getReservationsByMonth(Number(year), Number(month));
  res.json(busyDays);
};
