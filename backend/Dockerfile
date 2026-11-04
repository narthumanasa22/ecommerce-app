FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV DATABASE_URL="postgresql://user:pass@localhost:5432/db"

RUN npx prisma generate --config=prisma7.config.ts

EXPOSE 3000

CMD ["npm", "run", "dev"]