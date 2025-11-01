# Build React app
FROM node:18 AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# Serve with Nginx over HTTPS
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# Copy build output
COPY --from=build /app/build .

# Copy SSL certificates
COPY ./ssl/cert.pem /etc/ssl/certs/cert.pem
COPY ./ssl/key.pem /etc/ssl/private/key.pem

# Copy Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]
