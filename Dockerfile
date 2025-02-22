FROM node:18

WORKDIR /frontend
COPY app/package.json app/package-lock.json ./
RUN node --max-old-space-size=4096 $(which npm) install --no-fund --no-audit --legacy-peer-deps
COPY app ./app
WORKDIR /frontend/app

# 5173포트 환경변수 설정
ENV PORT=5173
EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
