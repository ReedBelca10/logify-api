# Logify API

English is the canonical API language. The API is designed for the Logify cross-platform delivery application and is available under the `/api` prefix.

Base URL: `http://localhost:3000/api`

## Authentication

Protected routes require:

```http
Authorization: Bearer <accessToken>
```

### Register

`POST /auth/register`

```json
{
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "password": "password123"
}
```

New accounts always receive the `CLIENT` role. Roles must not be supplied by public clients.

### Login

`POST /auth/login`

```json
{
  "email": "jane.doe@example.com",
  "password": "password123"
}
```

Successful responses use `accessToken`:

```json
{
  "message": "Login successful",
  "user": {
    "id": "64abc123...",
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "role": "CLIENT"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
}
```

### Firebase login

`POST /auth/firebase`

```json
{
  "firebaseToken": "<firebase-id-token>"
}
```

### Current profile

`GET /auth/profile`

Returns the authenticated user's profile.

## Delivery requests

Delivery request routes are available under `/delivery-requests`.

| Method | Route | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/delivery-requests` | Authenticated | Create a delivery request, optionally with a package photo |
| `GET` | `/delivery-requests/my-requests` | Client | List the current client's requests |
| `GET` | `/delivery-requests/my-deliveries` | Driver | List requests assigned to the current driver |
| `GET` | `/delivery-requests/my-stats` | Driver | Read driver statistics |
| `GET` | `/delivery-requests/:id` | Authenticated | Read one request |
| `PUT` | `/delivery-requests/:id/status` | Authenticated | Update a request status |
| `PUT` | `/delivery-requests/:id/cancel` | Client | Cancel a request |
| `GET` | `/delivery-requests` | `SUPERADMIN` | List all requests |
| `GET` | `/delivery-requests/stats` | `SUPERADMIN` | Read global statistics |
| `PUT` | `/delivery-requests/:id/assign/:idLivreur` | `SUPERADMIN` | Assign a driver |

Request statuses are currently `EN_ATTENTE`, `ASSIGNEE`, `LIVREE`, and `ANNULEE`. These values are persisted API identifiers; clients should translate them for display.

## Orders and menu

The API also exposes `/orders` and `/menu`. Swagger is the executable source of truth while these modules are being expanded:

```text
http://localhost:3000/api
```

## Roles

| Role | Purpose |
| --- | --- |
| `CLIENT` | Creates and tracks personal delivery requests and orders |
| `LIVREUR` | Handles assigned delivery work |
| `SUPERADMIN` | Manages users, menus, orders, assignments and global statistics |

## Error format

```json
{
  "statusCode": 400,
  "message": ["Email must be valid"],
  "error": "Bad Request"
}
```

## Status codes

`200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `409 Conflict`, and `500 Internal Server Error` are used according to the operation result.
