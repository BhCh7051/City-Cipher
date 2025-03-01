# Use Node.js Alpine as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Create a .env file if it doesn't exist
RUN touch .env

# Expose the port your backend runs on
EXPOSE 5000

# Command to run the server
CMD ["node", "server.js"] 