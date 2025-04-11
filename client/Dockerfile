# Stage 1: BUILD
FROM node:23-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build:prod

# Stage 2: RUN
FROM nginx:alpine

COPY nginx.conf  /etc/nginx/nginx.conf
COPY --from=build /app/dist/client /usr/share/nginx/html

EXPOSE 80
