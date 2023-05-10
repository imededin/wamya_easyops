FROM node
ARG FOLDER=./backend
ARG PORT=5000
# Set working directory
RUN mkdir app
WORKDIR /app

# Copy package.json and package-lock.json (if applicable)
COPY $FOLDER/package*.json ./

# Install dependencies
RUN npm install

# Copy source code into container
COPY $FOLDER .


# Expose the port used by the app
EXPOSE $PORT

# Start the app
CMD ["npm","start"]