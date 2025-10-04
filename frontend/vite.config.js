import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Permite acesso de qualquer IP
    port: 5173,       // Porta padrão; pode ser sobrescrita via CLI (--port)
    strictPort: false, // Permite escolher outra porta se 5173 estiver ocupada
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
