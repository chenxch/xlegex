import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Unocss from 'unocss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Unocss(),
  ],
  base: process.env.NODE_ENV === 'production' ? 'https://chenxch.github.io/xlegex/' : '/',
})
