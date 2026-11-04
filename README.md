# Ecommerce App

Stack: Node, TypeScript, Prisma, PostgreSQL, Redis (backend) + Vite frontend.

## Requirements
Node.js, PostgreSQL, Redis (port 6379), RabbitMQ (port 5672)

## Run
1. cd backend, copy .env.example to .env and fill values
2. npm install, npx prisma migrate deploy, npm run build, npm start
3. cd frontend, npm install, npm run build, npm run preview

## API routes
/auth (register, login), /products, /cart, /orders, /admin
