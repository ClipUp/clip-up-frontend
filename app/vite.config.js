// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  build: {
    outDir: 'dist', // 빌드 결과물이 저장될 디렉토리
    assetsDir: 'assets', // 정적 파일(이미지, css 등)이 저장될 디렉토리
    sourcemap: false, // 소스맵 생성 여부
    rollupOptions: {
      input: {
        main: 'app/index.html', // 엔트리 파일
      },
    },
  },
});
