import { Request, Response } from 'express';
import * as roomService from '../services/rooms.service';
import { getRoomWithReservations } from '../services/rooms.service';

export const getAllRooms = async (req: Request, res: Response) => {
  const { page = 1, limit = 10 } = req.query;
  const rooms = await roomService.getAllRooms(Number(page), Number(limit));
  res.json(rooms);
};

export const getRoomById = async (req: Request, res: Response) => {
  const room = await getRoomWithReservations(Number(req.params.id));
  res.json(room);
};

export const createRoom = async (req: Request, res: Response) => {
  const room = await roomService.createRoom(req.body);
  res.status(201).json(room);
};

export const updateRoom = async (req: Request, res: Response) => {
  const updatedRoom = await roomService.updateRoom(Number(req.params.id), req.body);
  res.json(updatedRoom);
};
