# Hiring Fullstack TODO

A full-stack TODO application implemented as a monorepo with a React (Vite) client and an Express.js server using MongoDB Atlas via Mongoose.

## Monorepo Structure

hiring-fullstack-todo/
- client/ — React frontend (Vite)
- server/ — Express backend (Node + Mongoose)

## Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB Atlas connection string

### Setup
1. Update `server/.env` with your MongoDB connection string and port:
```
MONGO_URI="mongodb+srv://<username>:<password>@cluster0.xvl2i.mongodb.net/?appName=Cluster0"
PORT=5000
```
2. Install dependencies:
```
npm install
npm install --prefix server
npm install --prefix client
```

### Development
Run both server and client:
```
npm run dev
```
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173`

### Production
- Start only the backend:
```
npm run start --prefix server
```
- Preview the frontend build:
```
npm run build --prefix client
npm run preview --prefix client
```

