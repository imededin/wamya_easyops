FROM node

RUN mkdir app
WORKDIR /app

# Copy package.json and package-lock.json (if applicable)
COPY ./package*.json ./

# Install dependencies
RUN npm install

# Copy source code into container
COPY . .


# Expose the port used by the app
EXPOSE 3000
RUN npm run build
RUN npm install -g serve

# Start the app
CMD ["serve","build"]