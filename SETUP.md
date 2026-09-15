# Logify API Setup

## Prerequisites

- Node.js 18 or newer
- npm
- MongoDB running locally or a MongoDB connection string
- Firebase Admin credentials only if Firebase authentication is enabled

## Install

```bash
npm install
```

## Environment

Create a `.env` file in this directory:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/food_delivery
JWT_SECRET=replace-with-a-long-random-secret
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
```

Keep `firebase-service-account.json` out of source control. Firebase authentication is optional; local email/password authentication works without it.

## Run

```bash
# Development
npm run start:dev

# Production build
npm run build
npm run start:prod
```

The API starts at `http://localhost:3000`. Swagger is available at `http://localhost:3000/api`.

## Seed an administrator

```bash
npm run seed
```

The seed creates the configured administrator account only when one does not already exist. Never commit real credentials.

## Test

```bash
npm run test
npm run test:e2e
npm run test:cov
```

## Client integration

Use `http://localhost:3000/api` as the development base URL. Authentication responses expose the token as `accessToken`; send it as a Bearer token on protected requests.
