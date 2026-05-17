# RN-Reviewer

A full-stack web application designed to help students prepare for the **Philippine Nursing Licensure Exam** in the Philippines. It provides structured study management tools including a topic reviewer, task tracker, score tracker, and daily agenda planner.

---

## Features

- **Reviewer** — Organize review books into topics and subtopics with deadlines, status tracking, and reference links
- **Task Tracker** — Log and manage study tasks with completion tracking
- **Score Tracker** — Record mock exam and practice test scores by subject and exam type
- **Daily Agenda** — Plan and track daily study goals
- **Authentication** — Secure login via email/password or Google OAuth (powered by Better Auth)
- **Protected Routes** — All core features are accessible only to authenticated users

---

## Tech Stack

### Client
| Tool | Purpose |
|---|---|
| React 19 + TypeScript | UI framework |
| Vite | Build tool and dev server |
| TanStack Router | File-based routing |
| TanStack Query | Server state management |
| TanStack Table | Data table rendering |
| Tailwind CSS v4 | Styling |
| Radix UI / shadcn/ui | Accessible UI components |
| Zustand | Client-side state management |
| React Hook Form + Zod | Form handling and validation |
| Better Auth (client) | Authentication client |
| Axios | HTTP client |
| Motion | Animations |

### Server
| Tool | Purpose |
|---|---|
| Bun | JavaScript runtime |
| Hono | Lightweight web framework |
| Drizzle ORM | Type-safe database ORM |
| PostgreSQL | Relational database |
| Better Auth | Authentication (email + Google OAuth) |
| Zod | Request validation |
| hono-rate-limiter | Rate limiting |

---

## Project Structure

```
RN-Reviewer/
├── client/                  # React frontend
│   ├── public/              # Static assets (logo, sounds, images)
│   └── src/
│       ├── components/      # UI components (reviewer, task-tracker, etc.)
│       ├── routes/          # TanStack Router file-based routes
│       │   ├── _protected/  # Auth-guarded routes
│       │   └── _public/     # Login & sign-up pages
│       ├── store/           # Zustand auth store
│       ├── lib/             # API client, auth client, utilities
│       └── @types/          # TypeScript type definitions
│
└── server/                  # Hono backend
    └── src/
        ├── controllers/     # Route handlers (books, topics, tasks, scores, agenda, users)
        ├── services/        # Business logic layer
        ├── db/              # Drizzle schema and migrations
        ├── middlewares/     # Auth, error handling, rate limiting, security
        ├── data/            # Seed/static data
        └── lib/             # Auth configuration
```


## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (v1.0+)
- [Node.js](https://nodejs.org/) (v18+ for client tooling)
- A PostgreSQL database
- Google OAuth credentials (for Google login)

---

### 1. Clone the repository

```bash
git clone https://github.com/constMelvin/RN-Reviewer.git
cd RN-Reviewer
```

---

### 2. Set up the Server

```bash
cd server
bun install
```

Create a `.env` file in the `server/` directory:

```env
PORT=4001
DATABASE_URL=postgresql://user:password@localhost:5432/rn_reviewer
BETTER_AUTH_SECRET=your_secret_here
BETTER_AUTH_URL=http://localhost:4001
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FRONTEND_URL=http://localhost:3000
```

Run database migrations:

```bash
bun run db:generate
bun run db:migrate
```

Start the development server:

```bash
bun run dev
```

The server runs at `http://localhost:4001`.

---

### 3. Set up the Client

```bash
cd ../client
bun install   # or npm install
```

Create a `.env` file in the `client/` directory (if needed for API base URL):

```env
VITE_API_URL=http://localhost:4001
```

Start the development server:

```bash
bun run dev   # or npm run dev
```

The client runs at `http://localhost:3000`.

---

## Available Scripts

### Server (`/server`)

| Script | Description |
|---|---|
| `bun run dev` | Start development server with nodemon |
| `bun run start` | Start production server |
| `bun run db:generate` | Generate Drizzle migrations |
| `bun run db:migrate` | Run migrations |
| `bun run db:push` | Push schema changes directly |
| `bun run db:studio` | Open Drizzle Studio (DB browser) |

### Client (`/client`)

| Script | Description |
|---|---|
| `bun run dev` | Start Vite dev server on port 3000 |
| `bun run build` | Build for production |
| `bun run test` | Run Vitest tests |
| `bun run lint` | Lint with ESLint |
| `bun run check` | Format + lint fix |


## Production Deployment

In production, the Hono server serves the built React client as static files with SPA fallback. Build the client first, then place the `dist/` output inside `server/client/dist/`.

```bash
# Build client
cd client && bun run build

# Copy dist to server
cp -r dist ../server/client/dist

# Start server in production
cd ../server && NODE_ENV=production bun run start
```

---

## License

This project is open source. See the repository for details.
