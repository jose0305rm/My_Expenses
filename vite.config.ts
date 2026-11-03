import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Rutas relativas: funciona en GitHub Pages (https://usuario.github.io/repo/)
  // y en cualquier otro hosting, sin importar el nombre del repositorio.
  base: './',
  plugins: [react(), tailwindcss()],
});
