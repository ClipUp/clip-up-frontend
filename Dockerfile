FROM node:16

WORKDIR /frontend
COPY app/package.json app/package-lock.json ./
RUN npm install
COPY app ./app
WORKDIR /frontend/app

# 5173포트 환경변수 설정
ENV PORT=5173
EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
