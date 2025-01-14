import { Router } from 'express';
import { getAllGuests, getGuestById, createGuest, updateGuest } from '../controllers/guests.controller';
import { validateGuestMiddleware } from '../middleware/validation';

const router = Router();

router.get('/', getAllGuests);
router.get('/:id', getGuestById);
router.post('/', validateGuestMiddleware, createGuest);
router.put('/:id', validateGuestMiddleware, updateGuest);

export default router;
