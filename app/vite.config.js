// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    cors: {
      origin: '*', // 모든 도메인 허용
      methods: ['GET', 'POST'], // 허용할 HTTP 메서드
      allowedHeaders: ['Content-Type'], // 허용할 헤더
    },
    hmr: {
      clientPort: 5173,
    },
  },
});
