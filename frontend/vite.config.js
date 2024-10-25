import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/leonardo/',
  server: {
    host: '0.0.0.0', // Ensure the server listens on all interfaces for Docker
    port: 5173, // Make sure this matches your Docker configuration
    proxy: {
      '/api': {
        target: 'http://backend-container:3000', // Replace with the name of your backend Docker container
        changeOrigin: true, // Needed for virtual hosted sites
        secure: false, // If the backend uses HTTPS with a self-signed certificate, use this option
      },
    },
  },
});
