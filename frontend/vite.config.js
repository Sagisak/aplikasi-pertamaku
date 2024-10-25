import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/leonardo/',
  server: {
    host: '0.0.0.0', // Ensure the server listens on all interfaces for Docker
    port: 5173, // Make sure this matches your Docker configuration
  },
})
