# Stage 1: Build the Vite project
FROM node:16-alpine AS build

WORKDIR /app

COPY package*.json ./


# Install project dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the Vite project
RUN npm run build

CMD ["npm", "run", "dev"]

# Expose port 3000
EXPOSE 3000
