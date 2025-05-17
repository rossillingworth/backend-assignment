# Backend Engineering Take-Home Assignment

## Architecture

Simple Express routing for REST API.  
Single handler function per endpoint.  
Zod for type definition, as it allows data validation as well.

Postman Collection for manual testing of API.  
OpenAPI specification can be used with Swagger UI/Editor (requires CORS)

## Setup Instructions

### 1. Install dependencies

```bash
npm install
```

### 2. Run the development server

```bash
npm run dev
```

### 3. Run tests

```bash
npm run test
```

## API Key Authentication

Granular control of authentication using a Router-level Middleware function.  
Protected requests need an extra header: x-api-key.  
This contains the shared secret that allows access. 

Add the following header to your requests:
```
x-api-key: my-secret-key
```

## API Endpoints

### Public Routes

- `GET /policies/:id` - Get policy by ID (includes product)
- `GET /policies?customerName=<name>` - Get policies by customer name

### Authenticated Routes

- `POST /policies` - Create a new policy
- `PUT /policies/:id` - Update an existing policy
- `DELETE /policies/:id` - Delete a policy

## Postman Collection

A Postman collection is included in `postman_collection.json`.
These can be used to get, create and delete data.
You can reset the data by restarting the server.

---

© Backend Engineering Assignment
