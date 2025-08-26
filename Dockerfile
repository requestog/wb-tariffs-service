
FROM node:20 AS builder
WORKDIR /app


COPY package*.json ./
RUN npm ci


COPY . .


RUN npm run build


FROM node:20-alpine AS app
WORKDIR /app


COPY package*.json ./
RUN npm ci --omit=dev


COPY --from=builder /app/dist ./dist

COPY wb-tariffs-service-470010-abcdd295e451.json ./


ENV NODE_ENV=production


CMD ["node", "dist/main.js"]


FROM node:20-alpine AS migrate
WORKDIR /app


COPY package*.json ./
RUN npm ci


COPY . .


CMD ["npx", "ts-node", "./node_modules/knex/bin/cli.js", "migrate:latest", "--knexfile", "src/modules/database/knexfile.ts"]