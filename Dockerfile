FROM oven/bun:1.2.8-alpine AS base

WORKDIR /app

COPY package.json ./

RUN bun i

COPY . .

WORKDIR /app

RUN bun run build

ENV NODE_ENV=production
ENV PORT=6701

EXPOSE 6701

ENTRYPOINT ["bun", "start"]