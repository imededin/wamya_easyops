FROM node
RUN mkdir /app
COPY . ./app
WORKDIR /app
RUN npm install 

CMD ["node","server.js"]