# 1. Official Node.js runtime as a parent image
FROM node:20-slim AS development

RUN apt-get update && apt-get install -y --no-install-recommends openssl

# 2. Create app directory
WORKDIR /usr/src/app

# 3. Copy application dependency manifests to the container image
COPY package.json pnpm-lock.yaml* ./

# 4. Install dependencies
RUN npm install -g pnpm && pnpm install

# 5. Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

# 6. Build the app
RUN pnpm run build

# 7. Start a new stage for production
FROM node:20-slim AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml* ./

RUN npm install -g pnpm && pnpm install

COPY --from=development /usr/src/app/dist ./dist

# 8. Run the app
CMD ["node", "dist/main"] 