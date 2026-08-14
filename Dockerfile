# Node.js image for the WorkoutNote API.
# Debian-slim (glibc) is used so bcrypt/pg native prebuilt binaries install cleanly.
FROM node:20-bookworm-slim

WORKDIR /app

# Install dependencies first for better layer caching.
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the application.
COPY . .

EXPOSE 8080

# Default command runs the production server.
# docker-compose overrides this with "npm run dev" for local development.
CMD ["npm", "start"]
