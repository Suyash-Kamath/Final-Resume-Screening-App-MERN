# Final Resume Screening Backend

## Overview
Node.js/Express backend for resume screening. Provides authentication, resume analysis with OpenAI, file storage in MongoDB GridFS, and MIS reporting.

## Project Structure
```
src/
  app.js                Express app wiring
  server.js             App bootstrap
  config/               Environment, constants, DB, OpenAI client
  controllers/          Route handlers
  middlewares/          Auth + error handling
  routes/               Route definitions
  services/             External services (OpenAI, email, GridFS)
  utils/                Helpers (date, prompts, text extraction)
  validators/           Request validation helpers
```

## Setup
1. Install dependencies
```
npm install
```

2. Required environment variables
```
MONGODB_URI=
OPENAI_API_KEY=
SMTP_SERVER=
SMTP_PORT=
EMAIL_USERNAME=
EMAIL_PASSWORD=
FROM_EMAIL=
FROM_NAME=
FRONTEND_BASE_URL=
PORT=8000
```

## Run
```
npm start
```

## Scripts
- `npm start` runs the server
- `npm run lint` runs ESLint
- `npm run format` formats with Prettier
- `npm run format:check` checks formatting

## API Base
All backend routes are mounted under `/backend`.
