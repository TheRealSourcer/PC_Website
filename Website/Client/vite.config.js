import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration to handle React and proxy API requests
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000', // Proxy API requests to the backend
    },
  },
});
