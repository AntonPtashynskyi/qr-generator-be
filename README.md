# QR Generator — backend

Briefly: a backend service for generating and managing QR codes.

## Requirements

- Node.js (12+ or a compatible version)
- npm or yarn
- Docker (for running MongoDB locally)

## Installation

1. Clone the repository and navigate to the project folder.
2. Install dependencies:

```bash
npm install
# or
yarn install

## Running the application

Run the application in development mode:


```bash
npm run start
# or
yarn start
```

## Running MongoDB in Docker (locally)

Start a MongoDB container:

```bash
docker run --name my-mongo -dit -p 27017:27017 --rm mongo:4.4.1
```

Connect to the container and open the MongoDB shell:

```bash
docker exec -it my-mongo mongo
```

Stop the container:

```bash
docker stop my-mongo
```

## Configuration

If the application uses environment variables (e.g. MONGODB_URI, PORT), create a .env file in the project root and specify the required values.
By default, MongoDB is expected at mongodb://localhost:27017.

## Project structure (main)

- `src/app.ts` — application entry point
- `src/qr-codes/` — controllers, model, and routes for QR codes
- `src/users/` — user controllers and routes
- `src/services/` — helper services (e.g., tokens)
- `src/middleware/` — middleware (authentication, cache, etc.)
- `src/errors/` — custom errors and handling

## Commands

- `npm install` — install dependencies
- `npm run start` — start the application

## API

Below are the main API endpoints found in the codebase with example `curl` requests. Replace `PORT` with the value your app uses (default often `3000`) and `BASE_URL` if configured.

- Sign up (create user)

```bash
curl -X POST http://localhost:PORT/sign-up \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}' \
  -c cookies.txt
```

Notes: server responds with `201` and sets an `accessToken` cookie. Use `-c cookies.txt` to save cookies for later authenticated requests.

- Login

```bash
curl -X POST http://localhost:PORT/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}' \
  -c cookies.txt
```

- Logout

```bash
curl -X POST http://localhost:PORT/logout \
  -b cookies.txt
```

- Create QR code (authenticated)

```bash
curl -X POST http://localhost:PORT/qrcodes \
  -H "Content-Type: application/json" \
  -d '{"target_url":"https://example.com"}' \
  -b cookies.txt
```

Response example:

```json
{
  "success": true,
  "qr_code_data_url": "data:image/png;base64,iVBORw0KGgo..."
}
```

- Redirect by QR id (public)

```bash
curl -v http://localhost:PORT/r/<qr_id>
```

This endpoint issues an HTTP `302` redirect to the original `target_url` and increments the `scan_count` in the database.