# Build stage for the frontend
FROM node:16 AS frontend-builder
WORKDIR /app
COPY package*.json ./
COPY client/ ./client/
WORKDIR /app/client
RUN npm install
RUN npm run build

# Production stage
FROM node:16-slim
WORKDIR /app

# Copy root package files
COPY package*.json ./

# Copy server files
COPY server/ ./server/

# Set working directory to server
WORKDIR /app/server

# Install production dependencies
RUN npm install --production

# Copy built frontend from builder
COPY --from=frontend-builder /app/client/build /app/client/build

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Expose the port the app runs on
EXPOSE 5000

# Command to run the application
CMD ["node", "server.js"]
