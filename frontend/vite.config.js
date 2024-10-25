import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    hmr: {
      host: '20.70.138.106',
      protocol: 'ws',
      port: 5173,
    },
  },
});
