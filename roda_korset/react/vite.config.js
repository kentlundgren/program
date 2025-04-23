import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',  // För statisk hosting med relativa sökvägar
  server: {
    port: 5173,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,  // Rensar dist-mappen helt innan varje ny build
    // Detta förhindrar att gamla assets-filer blir kvar
  }
}); 