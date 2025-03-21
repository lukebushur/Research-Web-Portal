# Build base image using node
FROM node:lts-alpine AS build
WORKDIR /usr/src/app

# Install modules
COPY ./client/package*.json .
RUN npm install

# Build application
COPY . .
RUN npm run build

# Build base for subsequent instructions using nginx image
FROM nginx:stable-alpine

# Copy config file
COPY ./client/nginx.conf /etc/nginx/nginx.conf

# Copy build files from earlier to directory used by nginx
COPY --from=build /usr/src/app/dist/client /usr/share/nginx/html

# front-end server listens on port 80
EXPOSE 4200
