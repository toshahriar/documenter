ARG NODE_VERSION=22.11.0
ARG BASE_IMAGE=alpine

# Build Stage
FROM node:${NODE_VERSION}-${BASE_IMAGE} AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY web/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY web/ .

# Build the application (for production)
RUN npm run build

# Development Stage
FROM node:${NODE_VERSION}-${BASE_IMAGE} AS dev

# Set working directory for the development environment
WORKDIR /app

# Copy package.json and package-lock.json
COPY web/package*.json ./

# Install both development and production dependencies
RUN npm install

# Copy the rest of the application code
COPY web/ .

# Expose the development port (Next.js defaults to port 3000)
EXPOSE 3000

# Start the Next.js app in development mode (with hot-reloading)
CMD ["npm", "run", "dev"]

# Production Stage
FROM node:${NODE_VERSION}-${BASE_IMAGE} AS prod

# Set working directory for the production image
WORKDIR /app

# Copy only the necessary files from the build stage (for production)
COPY --from=build /app /app

# Expose the production port
EXPOSE 3000

# Start the Next.js app in production mode
CMD ["npm", "run", "init"]
