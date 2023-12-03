# Build base image using node
FROM node:lts-alpine AS build
WORKDIR /usr/src/app

# Install modules
COPY package*.json .
RUN npm ci

# Build application
COPY . .
RUN npm run build

# Build base for subsequent instructions using nginx image 
FROM nginx:stable-alpine

# Copy config file
COPY nginx.conf /etc/nginx/nginx.conf

# Copy build files from earlier to directory used by nginx
COPY --from=build /usr/src/app/dist/client /usr/share/nginx/html

# front-end server listens on port 80
EXPOSE 4200