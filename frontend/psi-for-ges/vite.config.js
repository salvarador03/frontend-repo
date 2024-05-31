import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills() // Asegúrate de invocar la función si es necesario
  ],
  resolve: {
    alias: {
      'util': 'util', // Alias para 'util'
    }
  }
});
