import tailwindcss from '@tailwindcss/vite'
import swc from 'unplugin-swc'
import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'

export default defineConfig({
  plugins: [
    tailwindcss(),
    solidPlugin(),
    swc.vite(),
  ],
})
