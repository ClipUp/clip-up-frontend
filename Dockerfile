FROM node:18

WORKDIR /frontend/app
COPY app/package.json app/package-lock.json ./
RUN npm cache clean --force
RUN npm install --no-fund --no-audit --legacy-peer-deps --max-old-space-size=4096
COPY app ./
RUN npm install

# 5173포트 환경변수 설정
ENV PORT=5173
EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
