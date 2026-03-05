# Stage 1: Build the React application
FROM node:22-alpine AS build
WORKDIR /app

# Copy package files first to leverage Docker layer caching
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
