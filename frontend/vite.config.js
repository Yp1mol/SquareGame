import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' 

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      react: path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom'),
    },
  },
  server: {
    allowedHosts: [
      '.ngrok-free.app',
      '.localtunnel.me',
      '.lt.site',
      '.trycloudflare.com',
    ],

    proxy: {
      '/api': {
        target: 'http://localhost:3001', 
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})