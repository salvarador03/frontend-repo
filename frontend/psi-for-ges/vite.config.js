import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  base: '/frontend-repo/', // Para configurar la base correcta
  plugins: [
    react(),
    nodePolyfills()
  ],
  resolve: {
    alias: {
      'util': 'util', // Alias para 'util'
    }
  }
});
