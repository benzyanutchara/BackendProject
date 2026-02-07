# Election System Backend

A TypeScript-based backend for an online election system.

## Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Storage:** Supabase Storage (For Party logos & Candidate images)
- **Authentication:** JWT (JSON Web Tokens)

## Prerequisites

- Node.js >= 18
- PostgreSQL >= 14
- Supabase account (for file storage)

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Copy the environment file and configure:
```bash
cp .env.example .env
```

4. Configure your `.env` file:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/election_db
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key
PORT=3000
```

5. Create the database:
```bash
createdb election_db
```

6. Run migrations:
```bash
psql -d election_db -f migrations/001_init.sql
psql -d election_db -f migrations/002_seed.sql
```

## Running the Application

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Register a new user | - |
| POST | `/login` | Login user | - |
| POST | `/admin/login` | Login admin | - |
| GET | `/profile` | Get user profile | User |

### Public (`/api/public`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/constituencies` | List all constituencies | - |
| GET | `/constituencies/:id/results` | Get constituency results | - |
| GET | `/parties` | List all parties | - |
| GET | `/parties/:id` | Get party details | - |
| GET | `/parties/overview` | Get party seats overview | - |

### Voting (`/api/vote`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/candidates` | Get candidates in user's constituency | User |
| POST | `/` | Cast or update vote | User |
| GET | `/my-vote` | Get current user's vote | User |
| DELETE | `/` | Remove vote | User |

### EC Management (`/api/ec`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/parties` | Create party (with logo upload) | EC |
| GET | `/parties` | List all parties | EC |
| POST | `/candidates` | Create candidate (with image upload) | EC |
| GET | `/constituencies/:id/candidates` | Get candidates in constituency | EC |
| GET | `/constituencies` | List constituencies | EC |
| PATCH | `/constituencies/:id/close` | Close constituency voting | EC |
| PATCH | `/constituencies/:id/open` | Open constituency voting | EC |

### Admin Management (`/api/admin`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/constituencies` | Create constituency | Admin |
| GET | `/constituencies` | List constituencies | Admin |
| GET | `/users` | Search/List users | Admin |
| PATCH | `/users/:nationalId/promote` | Promote user to EC | Admin |
| PATCH | `/users/:nationalId/demote` | Demote EC to voter | Admin |

## Project Structure

```
election-system/
├── migrations/          # SQL migration files
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Request handlers
│   ├── middlewares/    # Express middlewares
│   ├── repositories/   # Database access layer
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── types/          # TypeScript types
│   ├── utils/          # Utility functions
│   ├── app.ts          # Express app setup
│   └── server.ts       # Server entry point
├── .env.example
├── package.json
└── tsconfig.json
```

## Sample Accounts (from seed data)

### Admin
- Username: `admin`
- Password: `admin123`

### Voter
- National ID: `1234567890123`
- Password: `password123`

### EC Staff
- National ID: `9876543210987`
- Password: `password123`

## License

ISC
