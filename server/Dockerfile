# Build base image using node
FROM public.ecr.aws/docker/library/node:lts-alpine AS build

# Change container working directory
WORKDIR /app

# Copy package.json and package-lock.json to container
COPY ./package*.json .

# Install dependencies
RUN npm install

# Copy server files to container
COPY . .

# Run back-end server, which listens on port 5000
EXPOSE 5000

# Start the server
CMD npm start
