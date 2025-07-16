# 1. Official Node.js runtime as a parent image
FROM node:20-slim AS development

RUN apt-get update && apt-get install -y --no-install-recommends openssl

# 2. Create app directory
WORKDIR /usr/src/app

# 3. Copy application dependency manifests to the container image
COPY package.json pnpm-lock.yaml* ./

# 4. Install dependencies
RUN npm install -g pnpm && pnpm install

# 5. Copy Prisma schema first
COPY prisma ./prisma/

# 6. Generate Prisma client
RUN pnpm prisma:generate

# 7. Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

# 8. Expose port
EXPOSE 3000

# 9. Development command (will be overridden by docker-compose)
CMD ["pnpm", "run", "start:dev"]

# 9. Start a new stage for production
FROM node:20-slim AS production

RUN apt-get update && apt-get install -y --no-install-recommends openssl

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml* ./

RUN npm install -g pnpm && pnpm install

# Copy Prisma schema and generate client
COPY prisma ./prisma/
RUN pnpm prisma:generate

# Remove dev dependencies after generating Prisma client
RUN pnpm install --prod

COPY --from=development /usr/src/app/dist ./dist

# 10. Run the app
CMD ["node", "dist/main"]