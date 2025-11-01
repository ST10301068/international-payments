# Use Node 18
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy backend source code
COPY . .

# Expose backend port (HTTP)
EXPOSE 5000

# Start backend
CMD ["npm", "run", "start"]
