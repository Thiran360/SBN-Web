import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.apk'],
  server: {
    proxy: {
      '/crm': {
        target: 'https://api.codingboss.in/',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})