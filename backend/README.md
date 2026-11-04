# Distributed E-Commerce Backend

A backend project built with Node.js, TypeScript, and Express to manage user authentication, shopping carts, and orders.

## Features

- User registration and login
- JWT-based authentication and role-based authorization
- Shopping cart management
- Order creation and order listing
- PostgreSQL database with Prisma ORM
- Redis-backed background jobs using BullMQ
- RabbitMQ messaging integration
- Docker-based infrastructure for PostgreSQL, Redis, and RabbitMQ

## Tech Stack

- Node.js
- TypeScript
- Express.js
- PostgreSQL
- Prisma ORM
- JWT
- Redis
- BullMQ
- RabbitMQ
- Docker
- Git and GitHub

## Prerequisites

Install Node.js, Docker Desktop, and Git before running the project.

## Setup

1. Clone the repository.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a local `.env` file using the environment variable names required by the application. Never commit secrets to GitHub.
4. Start the infrastructure services:

   ```bash
   docker compose up -d
   ```

5. Run the Prisma migrations and generate the Prisma Client using the scripts configured in `package.json`.
6. Start the development server using the project's configured npm script.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/register` | Register a user |
| POST | `/auth/login` | Log in |
| GET | `/auth/me` | Get authenticated user details |
| GET | `/auth/admin` | Admin-only endpoint |
| POST | `/cart` | Add a product to the cart |
| POST | `/orders` | Create an order |
| GET | `/orders` | List the authenticated user's orders |

Protected endpoints require a valid JWT Bearer token.

## Background Jobs and Messaging

BullMQ uses Redis to queue background jobs. The current email worker simulates email processing for development and testing. RabbitMQ is used for message-based communication.

## Security Notes

- Keep `.env` out of version control.
- Use strong secrets and database credentials.
- Validate inputs and protect authenticated routes.
- Do not expose credentials or JWT tokens in logs or public repositories.

## Project Status

Core authentication, cart, order, and background-job flows have been tested during development. Further validation and production deployment configuration may be needed before production use.