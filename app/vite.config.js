import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // 모든 IP에서 접근 허용
    port: 5173,
    strictPort: true, // 포트가 사용 중이면 종료 (중복 방지)
    cors: true, // CORS 활성화
    hmr: {
      clientPort: 80, // Nginx 프록시를 통한 HMR 연결
    },
    headers: {
      "Access-Control-Allow-Origin": "*", // CORS 허용
    },
  },
});

