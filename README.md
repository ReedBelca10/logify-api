# Logify API

NestJS API for Logify, a cross-platform delivery marketplace for restaurants, individuals and local delivery drivers.

The API provides authentication, users, menus, orders and delivery requests. The Flutter client lives in the sibling `logify` repository.

## Quick start

```bash
npm install
npm run start:dev
```

Read [SETUP.md](SETUP.md) for environment configuration and [API.md](API.md) for the HTTP contract.

Swagger: `http://localhost:3000/api`

## Architecture

- NestJS and TypeScript
- MongoDB with Mongoose
- JWT authentication
- Optional Firebase identity verification
- DTO validation with `class-validator`
- Swagger/OpenAPI documentation

## Roles

The current roles are `CLIENT`, `LIVREUR`, and `SUPERADMIN`. Role identifiers are stable API values; user interfaces translate them for display.

## Scripts

```bash
npm run start:dev  # Development server with watch mode
npm run build      # Production compilation
npm run test       # Unit tests
npm run test:e2e   # End-to-end tests
npm run seed       # Seed the administrator account
```
