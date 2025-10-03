# Real-time Chat App (NestJS + React + Socket.IO + Prisma)

## Features
- Real-time chat via Socket.IO with Redis adapter for multi-instance support
- NestJS backend with Prisma ORM (PostgreSQL)
- React (Vite) frontend
- PM2 cluster mode for backend
- Dockerized services with docker-compose (Postgres, Redis, Backend, Frontend)

## Architecture
- Backend: `backend/server` (NestJS).
- Frontend: `frontend/client` (Vite React).
- Shared infra via `docker-compose.yml`.

## Prerequisites
- Node 20+
- Docker and Docker Compose

## Local Development (without Docker)
1. Backend
```bash
cp backend/server/.env.example backend/server/.env || true
# Ensure DATABASE_URL and REDIS_URL are set in backend/server/.env
cd backend/server
npm install
npx prisma generate
# Create DB & apply schema (option 1: push)
npx prisma db push
# or run migrations if you add them later
# npx prisma migrate dev --name init
npm run start:dev
```
2. Frontend
```bash
cd frontend/client
npm install
# If backend URL differs, set VITE_BACKEND_URL in .env
npm run dev
```
Open `http://localhost:5173`.

## Run with Docker
```bash
# From project root
docker compose up --build
```
- Backend: `http://localhost:3000`
- Frontend: `http://localhost:5173`

## PM2 Cluster (production-like)
```bash
cd backend/server
npm run build
npm run pm2
pm2 ls
```
PM2 will run `dist/main.js` in cluster mode. Socket.IO uses Redis to fan out messages across instances.

## Environment Variables
Backend (`backend/server/.env.example`):
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/chat_app?schema=public
REDIS_URL=redis://localhost:6379
PORT=3000
```
Frontend (`frontend/client/.env`):
```
VITE_BACKEND_URL=http://localhost:3000
```

## API
- `GET /rooms` – list rooms
- `GET /rooms/:name/history` – last 100 messages

## Socket.IO Events
- `join` – payload: `{ room, username }`
- `message` – payload: `{ room, username, content }`

## Screenshots
Add screenshots here:
- `frontend/client/public/screenshot-1.png`
- `frontend/client/public/screenshot-2.png`

## GitHub
```bash
git init
git add .
git commit -m "Initial chat app"
git branch -M master
git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin master
```

## Notes
- Ensure Postgres and Redis are reachable from the backend (envs correct).
- If running PM2 in containers, prefer one instance per container and scale via compose/k8s, or run PM2 cluster with Redis adapter (already configured).

<img width="910" height="554" alt="image" src="https://github.com/user-attachments/assets/dd20ade8-32ab-46c5-966b-6c97aa2b5f8e" />


