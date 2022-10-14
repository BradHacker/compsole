FROM node:16 as builder
WORKDIR /app
COPY . .
RUN npm i
RUN npm run build

FROM nginx:stable
WORKDIR /app
COPY ./docker_files/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build/ /app/
EXPOSE 80 443
