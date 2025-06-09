// frontend/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Asegúrate de que el servidor de Vite sea accesible desde fuera del contenedor
    host: '0.0.0.0',
    port: 5173,
    // Configuración del proxy para la API
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // El backend de Flask
        changeOrigin: true,
      }
    }
  }
})