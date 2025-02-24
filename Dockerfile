FROM node:16 AS build

WORKDIR /app

COPY app/package.json app/package-lock.json ./
RUN npm install

COPY app/ ./
RUN npm run build


FROM nginx:alpine
COPY app/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
