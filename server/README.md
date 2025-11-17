# Server (Express + Mongoose)

## Installation
```
npm install --prefix server
```

## Environment
Create `server/.env`:
```
MONGO_URI="mongodb+srv://<username>:<Password>@cluster0.xvl2i.mongodb.net/?appName=Cluster0"
PORT=5000
```

## Run
- Development:
```
npm run dev --prefix server
```
- Production:
```
npm run start --prefix server
```

## API
Base URL: `http://localhost:5000/api/todos`

- GET `/` — List todos (sorted by `createdAt` desc)
- POST `/` — Create todo `{ title, description? }`
- PUT `/:id` — Update `{ title?, description? }`
- PATCH `/:id/done` — Toggle `done`
- DELETE `/:id` — Delete by ID

## DB Info
- Database name: `todoapp`
- Schema fields: `title` (required), `description` (default `""`), `done` (default `false`)
- Timestamps: `createdAt`, `updatedAt`