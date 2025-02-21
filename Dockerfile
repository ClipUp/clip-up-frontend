# Node.js 환경 설정
FROM node:18

WORKDIR /frontend
COPY app ./app
WORKDIR /frontend/app

# React 앱 설치 & 실행
RUN npm install

# 5173포트 환경변수 설정
ENV PORT=5173
EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
