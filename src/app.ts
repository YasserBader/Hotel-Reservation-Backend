import express from 'express';
import bodyParser from 'body-parser';
import guestRoutes from './routes/guests.routes';
import roomRoutes from './routes/rooms.routes';
import reservationRoutes from './routes/reservations.routes';

const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/guests', guestRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/reservations', reservationRoutes);

export default app;
