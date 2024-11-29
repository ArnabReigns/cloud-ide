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
RUN npm install

# Expose the port for the server
EXPOSE 5000

# user restrictions
# RUN addgroup -S mygroup && adduser -S myuser -G mygroup
# RUN chown -R myuser:mygroup /app
# USER myuser


CMD ["node", "/root/bridge/index.js"]
# Start the server

