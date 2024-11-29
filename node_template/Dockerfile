FROM node:alpine


# Install bash
RUN apk add --no-cache bash

# Create app directory
WORKDIR /root/bridge/

# Copy package.json and install dependencies
COPY ./package.json ./
RUN npm install

# Copy the rest of the files
COPY ./ .

WORKDIR /app/node/
COPY ./node/ .

# Expose the port for the server
EXPOSE 5000

CMD ["node", "/root/bridge/index.js"]
# Start the server

