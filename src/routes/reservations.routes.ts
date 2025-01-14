import { Router } from 'express';
import {
  getAllReservations,
  getReservationById,
  createReservation,
  updateReservation,
  getReservationsCalendar,
} from '../controllers/reservations.controller';
import { validateReservationMiddleware } from '../middleware/validation';

const router = Router();

router.get('/', getAllReservations);
router.get('/:id', getReservationById);
router.post('/', validateReservationMiddleware, createReservation);
router.put('/:id', validateReservationMiddleware, updateReservation);
router.get('/calendar', getReservationsCalendar);

export default router;
