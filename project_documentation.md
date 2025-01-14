# Project Documentation

## Directory Structure

```
├── app.ts
├── config
├── controllers
│   ├── guests.controller.ts
│   ├── reservations.controller.ts
│   └── rooms.controller.ts
├── db
│   ├── index.ts
│   ├── migrations
│   │   ├── 001_create_guests_table.ts
│   │   ├── 002_create_rooms_table.ts
│   │   └── 003_create_reservations_table.ts
│   └── seeds
│       ├── 001_guests_seed.ts
│       ├── 002_rooms_seed.ts
│       └── 003_reservations_seed.ts
├── middleware
│   └── validation.ts
├── routes
│   ├── guests.routes.ts
│   ├── reservations.routes.ts
│   └── rooms.routes.ts
├── server.ts
├── services
│   ├── guest.service.ts
│   ├── reservations.service.ts
│   └── rooms.service.ts
├── tests
│   ├── guest.service.spec.ts
│   ├── guests.routes.spec.ts
│   ├── reservations.routes.spec.ts
│   ├── reservations.service.spec.ts
│   ├── rooms.routes.spec.ts
│   └── rooms.service.spec.ts
├── types
│   ├── guest.types.ts
│   ├── reservations.types.ts
│   └── rooms.types.ts
└── utils

```

## File: src\app.ts
```
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

```

---

## File: src\controllers\guests.controller.ts
```
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

```

---

## File: src\controllers\reservations.controller.ts
```
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

```

---

## File: src\controllers\rooms.controller.ts
```
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

```

---

## File: src\db\index.ts
```
import { knex } from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const db = knex({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  migrations: {
    directory: './src/db/migrations',
  },
  seeds: {
    directory: './src/db/seeds',
  },
});

export default db;

```

---

## File: src\db\migrations\001_create_guests_table.ts
```
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('guests', (table) => {
    table.increments('guest_id').primary();
    table.string('name', 100).notNullable();
    table.string('email', 100).notNullable().unique();
    table.string('phone_number', 15).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('guests');
}

```

---

## File: src\db\migrations\002_create_rooms_table.ts
```
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('rooms', (table) => {
    table.increments('room_id').primary();
    table.string('room_number', 10).notNullable().unique();
    table.string('room_name', 100).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('rooms');
}

```

---

## File: src\db\migrations\003_create_reservations_table.ts
```
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('reservations', (table) => {
    table.increments('reservation_id').primary();
    table.integer('room_id').unsigned().references('room_id').inTable('rooms').onDelete('CASCADE');
    table.integer('guest_id').unsigned().references('guest_id').inTable('guests').onDelete('CASCADE');
    table.date('check_in_date').notNullable();
    table.date('check_out_date').notNullable();
    table.string('status', 20).defaultTo('active');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('reservations');
}

```

---

## File: src\db\seeds\001_guests_seed.ts
```
import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex('guests').del(); // Clear existing data
  await knex('guests').insert([
    { name: 'John Doe', email: 'john@example.com', phone_number: '1234567890' },
    { name: 'Jane Smith', email: 'jane@example.com', phone_number: '0987654321' },
    { name: 'Alice Johnson', email: 'alice@example.com', phone_number: '2345678901' },
    { name: 'Bob Brown', email: 'bob@example.com', phone_number: '3456789012' },
    { name: 'Charlie Davis', email: 'charlie@example.com', phone_number: '4567890123' },
    { name: 'Diana Evans', email: 'diana@example.com', phone_number: '5678901234' },
    { name: 'Eve Ford', email: 'eve@example.com', phone_number: '6789012345' },
    { name: 'Frank Green', email: 'frank@example.com', phone_number: '7890123456' },
    { name: 'Grace Hall', email: 'grace@example.com', phone_number: '8901234567' },
    { name: 'Hank Ives', email: 'hank@example.com', phone_number: '9012345678' },
  ]);
}

```

---

## File: src\db\seeds\002_rooms_seed.ts
```
import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex('rooms').del(); // Clear existing data
  await knex('rooms').insert([
    { room_number: '101', room_name: 'Standard Room' },
    { room_number: '102', room_name: 'Deluxe Room' },
    { room_number: '103', room_name: 'Suite Room' },
    { room_number: '104', room_name: 'Family Room' },
    { room_number: '105', room_name: 'Presidential Suite' },
    { room_number: '106', room_name: 'Studio Apartment' },
    { room_number: '107', room_name: 'Penthouse' },
    { room_number: '108', room_name: 'Business Suite' },
    { room_number: '109', room_name: 'Economy Room' },
    { room_number: '110', room_name: 'Superior Room' },
  ]);
}

```

---

## File: src\db\seeds\003_reservations_seed.ts
```
import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex('reservations').del(); // Clear existing data
  const guests = await knex('guests').select('guest_id');
  const rooms = await knex('rooms').select('room_id');

  const guestIds = guests.map((guest) => guest.guest_id);
  const roomIds = rooms.map((room) => room.room_id);
  await knex('reservations').insert([
    {
      room_id: roomIds[0],
      guest_id: guestIds[0],
      check_in_date: '2025-01-01',
      check_out_date: '2025-01-07',
      status: 'active',
    },
    {
      room_id: roomIds[1],
      guest_id: guestIds[1],
      check_in_date: '2025-01-05',
      check_out_date: '2025-01-10',
      status: 'active',
    },
    {
      room_id: roomIds[2],
      guest_id: guestIds[2],
      check_in_date: '2025-01-10',
      check_out_date: '2025-01-15',
      status: 'active',
    },
    {
      room_id: roomIds[3],
      guest_id: guestIds[3],
      check_in_date: '2025-01-15',
      check_out_date: '2025-01-20',
      status: 'canceled',
    },
    {
      room_id: roomIds[4],
      guest_id: guestIds[4],
      check_in_date: '2025-01-20',
      check_out_date: '2025-01-25',
      status: 'active',
    },
    {
      room_id: roomIds[5],
      guest_id: guestIds[5],
      check_in_date: '2025-01-25',
      check_out_date: '2025-01-30',
      status: 'active',
    },
    {
      room_id: roomIds[6],
      guest_id: guestIds[6],
      check_in_date: '2025-02-01',
      check_out_date: '2025-02-05',
      status: 'active',
    },
    {
      room_id: roomIds[7],
      guest_id: guestIds[7],
      check_in_date: '2025-02-05',
      check_out_date: '2025-02-10',
      status: 'canceled',
    },
    {
      room_id: roomIds[8],
      guest_id: guestIds[8],
      check_in_date: '2025-02-10',
      check_out_date: '2025-02-15',
      status: 'active',
    },
    {
      room_id: roomIds[9],
      guest_id: guestIds[9],
      check_in_date: '2025-02-15',
      check_out_date: '2025-02-20',
      status: 'active',
    },
    {
      room_id: roomIds[1],
      guest_id: guestIds[2],
      check_in_date: '2025-02-21',
      check_out_date: '2025-02-25',
      status: 'active',
    },
    {
      room_id: roomIds[4],
      guest_id: guestIds[5],
      check_in_date: '2025-03-01',
      check_out_date: '2025-03-05',
      status: 'canceled',
    },
    {
      room_id: roomIds[7],
      guest_id: guestIds[3],
      check_in_date: '2025-03-10',
      check_out_date: '2025-03-15',
      status: 'active',
    },
    {
      room_id: roomIds[3],
      guest_id: guestIds[6],
      check_in_date: '2025-03-15',
      check_out_date: '2025-03-20',
      status: 'active',
    },
    {
      room_id: roomIds[8],
      guest_id: guestIds[0],
      check_in_date: '2025-03-20',
      check_out_date: '2025-03-25',
      status: 'active',
    },
  ]);
}

```

---

## File: src\middleware\validation.ts
```
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

```

---

## File: src\routes\guests.routes.ts
```
import { Router } from 'express';
import { getAllGuests, getGuestById, createGuest, updateGuest } from '../controllers/guests.controller';
import { validateGuestMiddleware } from '../middleware/validation';

const router = Router();

router.get('/', getAllGuests);
router.get('/:id', getGuestById);
router.post('/', validateGuestMiddleware, createGuest);
router.put('/:id', validateGuestMiddleware, updateGuest);

export default router;

```

---

## File: src\routes\reservations.routes.ts
```
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

```

---

## File: src\routes\rooms.routes.ts
```
import { Router } from 'express';
import { getAllRooms, getRoomById, createRoom, updateRoom } from '../controllers/rooms.controller';
import { validateRoomMiddleware } from '../middleware/validation';

const router = Router();

router.get('/', getAllRooms);
router.get('/:id', getRoomById);
router.post('/', validateRoomMiddleware, createRoom);
router.put('/:id', validateRoomMiddleware, updateRoom);

export default router;

```

---

## File: src\server.ts
```
import app from './app';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

```

---

## File: src\services\guest.service.ts
```
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

```

---

## File: src\services\reservations.service.ts
```
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

```

---

## File: src\services\rooms.service.ts
```
import db from '../db';

export const getAllRooms = async (page: number, limit: number, sortBy = 'room_id', order = 'asc') => {
  const offset = (page - 1) * limit;
  return db('rooms').select('*').orderBy(sortBy, order).limit(limit).offset(offset);
};

export const getRoomById = async (id: number) => {
  return db('rooms').where({ room_id: id }).first();
};

export const createRoom = async (data: any) => {
  return db('rooms').insert(data).returning('*');
};

export const updateRoom = async (id: number, data: any) => {
  return db('rooms').where({ room_id: id }).update(data).returning('*');
};

export const getRoomWithReservations = async (roomId: number) => {
  const room = await db('rooms').where({ room_id: roomId }).first();
  const reservations = await db('reservations')
    .where('room_id', roomId)
    .andWhere('check_out_date', '>=', db.fn.now())
    .orderBy('check_in_date', 'asc');
  return { ...room, reservations };
};

```

---

## File: src\tests\guest.service.spec.ts
```
import * as guestService from '../services/guest.service';
import db from '../db';

describe('Guest Service', () => {
  beforeAll(async () => {
    await db.migrate.latest();
    await db.seed.run();
  });

  afterAll(async () => {
    await db.destroy();
  });

  it('should fetch paginated guests sorted by name in descending order', async () => {
    jest.setTimeout(10000);
    const guests = await guestService.getAllGuests(1, 5, 'name', 'desc');
    expect(guests).toHaveLength(5);
    expect(guests[0].name).toBe('John Doe'); // Example assertion
  });

  it('should fetch paginated guests sorted by email in ascending order', async () => {
    jest.setTimeout(10000);
    const guests = await guestService.getAllGuests(1, 5, 'email', 'asc');
    expect(guests).toHaveLength(5);
    expect(guests[0].email).toBe('alice@example.com'); // Example assertion
  });
});

```

---

## File: src\tests\guests.routes.spec.ts
```
import request from 'supertest';
import app from '../app';
import db from '../db';

beforeAll(async () => {
  await db.migrate.latest();
  await db.seed.run();
});

afterAll(async () => {
  await db.destroy();
});

describe('Guest Routes', () => {
  it('should fetch all guests', async () => {
    const response = await request(app).get('/api/guests?page=1&limit=5');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(5);
  });

  it('should create a new guest', async () => {
    const response = await request(app).post('/api/guests').send({
      name: 'New Guest',
      email: 'newguest@example.com',
      phone_number: '1234567890',
    });
    expect(response.status).toBe(201);
    expect(response.body.name).toBe('New Guest');
  });

  it('should return validation error for invalid guest data', async () => {
    const response = await request(app).post('/api/guests').send({
      name: '',
      email: 'invalid-email',
      phone_number: '',
    });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid guest data');
  });
});

```

---

## File: src\tests\reservations.routes.spec.ts
```
import request from 'supertest';
import app from '../app';
import db from '../db';

beforeAll(async () => {
  await db.migrate.latest();
  await db.seed.run();
});

afterAll(async () => {
  await db.destroy();
});

describe('Reservation Routes', () => {
  it('should fetch all reservations', async () => {
    const response = await request(app).get('/api/reservations?page=1&limit=5');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(5);
  });

  it('should create a new reservation', async () => {
    const response = await request(app).post('/api/reservations').send({
      guest_id: 1,
      room_id: 1,
      check_in_date: '2025-01-01',
      check_out_date: '2025-01-07',
    });
    expect(response.status).toBe(201);
    expect(response.body.guest_id).toBe(1);
    expect(response.body.room_id).toBe(1);
  });

  it('should return conflict for overlapping reservations', async () => {
    const response = await request(app).post('/api/reservations').send({
      guest_id: 2,
      room_id: 1,
      check_in_date: '2025-01-05',
      check_out_date: '2025-01-10',
    });
    expect(response.status).toBe(409);
    expect(response.body.error).toBe('Room is already booked for the selected dates');
  });
});

```

---

## File: src\tests\reservations.service.spec.ts
```
import * as reservationService from '../services/reservations.service';
import db from '../db';

describe('Reservation Service', () => {
  beforeAll(async () => {
    await db.migrate.latest();
    await db.seed.run();
  });

  afterAll(async () => {
    await db.destroy();
  });

  it('should fetch paginated reservations sorted by check_in_date in ascending order', async () => {
    jest.setTimeout(10000);
    const reservations = await reservationService.getAllReservations(1, 5, 'check_in_date', 'asc');
    expect(reservations).toHaveLength(5);
    expect(reservations[0].check_in_date.toISOString()).toBe('2025-01-01T00:00:00.000Z'); // Example assertion
  });

  it('should fetch paginated reservations sorted by status in descending order', async () => {
    jest.setTimeout(10000);
    const reservations = await reservationService.getAllReservations(1, 5, 'status', 'desc');
    expect(reservations).toHaveLength(5);
    expect(reservations[0].status).toBe('canceled'); // Example assertion
  });
});

```

---

## File: src\tests\rooms.routes.spec.ts
```
import request from 'supertest';
import app from '../app';
import db from '../db';

beforeAll(async () => {
  await db.migrate.latest();
  await db.seed.run();
});

afterAll(async () => {
  await db.destroy();
});

describe('Room Routes', () => {
  it('should fetch all rooms', async () => {
    const response = await request(app).get('/api/rooms?page=1&limit=5');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(5);
  });

  it('should create a new room', async () => {
    const response = await request(app).post('/api/rooms').send({
      room_number: '202',
      room_name: 'Test Room',
    });
    expect(response.status).toBe(201);
    expect(response.body.room_number).toBe('202');
  });

  it('should return validation error for invalid room data', async () => {
    const response = await request(app).post('/api/rooms').send({
      room_number: '',
      room_name: '',
    });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid room data');
  });
});

```

---

## File: src\tests\rooms.service.spec.ts
```
import db from '../db';
import * as roomService from '../services/rooms.service';

describe('Room Service', () => {
  beforeAll(async () => {
    await db.migrate.latest();
    await db.seed.run();
  });

  afterAll(async () => {
    await db.destroy();
  });

  it('should fetch paginated rooms sorted by room_name in ascending order', async () => {
    const rooms = await roomService.getAllRooms(1, 5, 'room_name', 'asc');
    expect(rooms).toHaveLength(5);
    expect(rooms[0].room_name).toBe('Business Suite');
  });

  it('should fetch paginated rooms sorted by room_number in descending order', async () => {
    const rooms = await roomService.getAllRooms(1, 5, 'room_number', 'desc');
    expect(rooms).toHaveLength(5);
    expect(rooms[0].room_number).toBe('110');
  });
});

```

---

## File: src\types\guest.types.ts
```
export interface Guest {
  guest_id: number;
  name: string;
  email: string;
  phone_number: string;
  created_at: Date;
  updated_at: Date;
}

```

---

## File: src\types\reservations.types.ts
```
export interface Reservation {
  reservation_id: number;
  guest_id: number;
  room_id: number;
  check_in_date: string;
  check_out_date: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

```

---

## File: src\types\rooms.types.ts
```
export interface Room {
  room_id: number;
  room_number: string;
  room_name: string;
  created_at: Date;
  updated_at: Date;
}

```

---

