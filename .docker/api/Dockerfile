ARG NODE_VERSION=22.11.0
ARG BASE_IMAGE=alpine

# Build Stage
FROM node:${NODE_VERSION}-${BASE_IMAGE} AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY api/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY api/ .

# Build the application (assuming `npm run build` is available)
RUN npm run build

# Development Stage
FROM node:${NODE_VERSION}-${BASE_IMAGE} AS dev

# Set working directory for the development environment
WORKDIR /app

# Copy package.json and package-lock.json
COPY api/package*.json ./

# Install both development and production dependencies
RUN npm install

# Copy the rest of the application code
COPY api/ .

# Expose the development port (default for Node.js is 3000)
EXPOSE 3000

# Start the Express server in development mode (e.g., using `nodemon` or similar)
CMD ["npm", "run", "dev"]

# Production Stage
FROM node:${NODE_VERSION}-${BASE_IMAGE} AS prod

# Set working directory for the production image
WORKDIR /app

# Copy only the necessary files from the build stage (from /app/build)
COPY --from=build /app /app

# Expose the API port
EXPOSE 3000

# Start the Express server in production mode
CMD ["npm", "run", "init"]
