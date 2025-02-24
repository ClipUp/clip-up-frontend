import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    cors: true,
    hmr: {
      clientPort: 443,
    },
    middlewareMode: true,
    configureServer(server) {
      server.middlewares.use('/health', (_, res) => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('ok');
      });
    },
  }
})
