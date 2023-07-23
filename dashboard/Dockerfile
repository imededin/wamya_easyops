# Use the official Node.js LTS (Long Term Support) as the base image
FROM node as builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if applicable)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code into the container
COPY . .

# Build the app
RUN npm run build

# Use Nginx as the final base image
FROM nginx:latest

# Copy the custom nginx.conf file to the Nginx configuration directory
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the built app from the builder stage to the Nginx default public directory
COPY --from=builder /app/build /usr/share/nginx/html

# Expose the port used by Nginx (default is 80)
EXPOSE 3002

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]