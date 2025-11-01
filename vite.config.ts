import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/v1': {
        target: 'http://0.0.0.0:8080',
        changeOrigin: true,
        secure: false,
        timeout: 120000,
      },
    },
  },
})
