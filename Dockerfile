# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the app and build
COPY . .
RUN npm run build


# Stage 2: Run
FROM node:18-alpine

WORKDIR /app

# Copy only built files + package for runtime dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

# If your app needs env vars, you can set defaults here
ENV NODE_ENV=production

CMD ["npm", "start"]