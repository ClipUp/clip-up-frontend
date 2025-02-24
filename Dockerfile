FROM node:16 AS builder

WORKDIR /app

COPY app/package.json app/package-lock.json ./
RUN npm install
COPY app/ ./
RUN npm run build

FROM nginx:alpine
COPY app/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]