FROM oven/bun:1 AS development
WORKDIR /app
COPY package*.json ./
RUN bun install
COPY . .
EXPOSE 8080
CMD ["bun", "--hot", "src/index.ts"]

FROM oven/bun:1 AS production
WORKDIR /app
COPY package*.json ./
RUN bun install --production
COPY . .
EXPOSE 8080
CMD ["bun", "src/index.ts"]