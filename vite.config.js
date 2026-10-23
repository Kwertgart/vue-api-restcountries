import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// "base" debe ser el nombre del repositorio entre diagonales,
// para que GitHub Pages encuentre los archivos del sitio.
export default defineConfig({
  plugins: [vue()],
  base: '/vue-api-restcountries/',
})
