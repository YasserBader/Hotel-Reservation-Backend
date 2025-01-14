import { Request, Response } from 'express';
import * as guestService from '../services/guest.service';

export const getAllGuests = async (req: Request, res: Response) => {
  const { page = 1, limit = 10 } = req.query;
  const guests = await guestService.getAllGuests(Number(page), Number(limit));
  res.json(guests);
};

export const getGuestById = async (req: Request, res: Response) => {
  const guest = await guestService.getGuestById(Number(req.params.id));
  res.json(guest);
};

export const createGuest = async (req: Request, res: Response) => {
  const guest = await guestService.createGuest(req.body);
  res.status(201).json(guest);
};

export const updateGuest = async (req: Request, res: Response) => {
  const updatedGuest = await guestService.updateGuest(Number(req.params.id), req.body);
  res.json(updatedGuest);
};
