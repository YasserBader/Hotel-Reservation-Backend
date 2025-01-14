import { Router } from 'express';
import { getAllRooms, getRoomById, createRoom, updateRoom } from '../controllers/rooms.controller';
import { validateRoomMiddleware } from '../middleware/validation';

const router = Router();

router.get('/', getAllRooms);
router.get('/:id', getRoomById);
router.post('/', validateRoomMiddleware, createRoom);
router.put('/:id', validateRoomMiddleware, updateRoom);

export default router;
