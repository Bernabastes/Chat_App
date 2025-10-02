FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM node:20-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./
COPY ecosystem.config.cjs ./
COPY entrypoint.sh ./
RUN npm i -g pm2 prisma && prisma generate
EXPOSE 3000
ENTRYPOINT ["/app/entrypoint.sh"]


