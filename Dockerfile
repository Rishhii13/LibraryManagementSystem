
FROM node:24-alpine

WORKDIR /app

# Copy backend package files
COPY server/package*.json ./

# Install backend dependencies
RUN npm install

# Copy backend application
COPY server/ ./

# Render backend port
EXPOSE 5000

# Start Express backend
CMD ["node", "server.js"]
