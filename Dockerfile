# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:22-alpine

WORKDIR /app

# Copy package files for production install
COPY package*.json ./

# Install production dependencies (including express and http-proxy-middleware)
RUN npm install --omit=dev && npm install express http-proxy-middleware

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist
# Copy server script
COPY server.js ./

# Expose port 3000
EXPOSE 3000

# Start the application using the custom server
CMD ["node", "server.js"]
