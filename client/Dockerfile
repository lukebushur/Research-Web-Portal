# Build base image using node
FROM public.ecr.aws/docker/library/node:lts-alpine AS build

# Change container working directory
WORKDIR /dist/src/app

# Force clean npm cache
RUN npm cache clean --force

# Copy Angular project filels
COPY . .

# Install dependencies
RUN npm install

# Build application
RUN npm run build

# Build base for subsequent instructions using nginx image
FROM public.ecr.aws/nginx/nginx:latest

# Copy Angular build files to nginx serving directory
COPY --from=build /dist/src/app/dist/client /usr/share/nginx/html

# # Copy nginx config file
COPY ./nginx.conf /etc/nginx/nginx.conf

# front-end server listens on port 80
EXPOSE 80
