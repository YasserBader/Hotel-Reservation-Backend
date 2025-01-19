# Hotel Reservation System Backend

## Overview

The Hotel Reservation System is a full-stack application designed for managing hotel operations, including guests, rooms, and reservations. This system features a backend built with Node.js, Express.js, and PostgreSQL, and a frontend developed using Angular and Taiga UI.

## Features

### Guests Management

- View paginated guest lists.
- Retrieve guest details, including total past reservations.
- Create and update guest information.

### Rooms Management

- View paginated room lists with sorting options.
- Retrieve room details, including current and upcoming reservations.
- Create and update room information.

### Reservations Management

- View paginated reservation lists.
- Retrieve reservations with room and guest details.
- Calendar view for monthly reservations with busy day highlights.
- Create reservations with date range validation and conflict detection.
- Cancel reservations.

## Backend Directory Structure

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
│   └── seeds
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

## Prerequisites

- Node.js v14 or later
- PostgreSQL
- Angular CLI
- Taiga UI
- npm or yarn

## Setup Instructions

### Backend Setup

1. Clone the repository.
2. Navigate to the backend directory.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Configure environment variables in `.env`:
   ```env
   DB_HOST=your-database-host
   DB_USER=your-database-user
   DB_PASSWORD=your-database-password
   DB_NAME=your-database-name
   ```
5. Run database migrations and seed data:
   ```bash
   npm run migrate
   npm run seed
   ```
6. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   ng serve
   ```

## API Endpoints

### Guests

- `GET /api/guests`: Retrieve paginated guests.
- `GET /api/guests/:id`: Retrieve guest details.
- `POST /api/guests`: Create a guest.
- `PUT /api/guests/:id`: Update guest details.

### Rooms

- `GET /api/rooms`: Retrieve paginated rooms.
- `GET /api/rooms/:id`: Retrieve room details.
- `POST /api/rooms`: Create a room.
- `PUT /api/rooms/:id`: Update room details.

### Reservations

- `GET /api/reservations`: Retrieve paginated reservations.
- `GET /api/reservations/:id`: Retrieve reservation details.
- `POST /api/reservations`: Create a reservation.
- `PUT /api/reservations/:id`: Update reservation details.
- `DELETE /api/reservations/:id`: Cancel a reservation.
- `GET /api/reservations/calendar`: Retrieve monthly reservations.

## Testing

Run unit and integration tests using Jest and Supertest:

```bash
npm test
```
