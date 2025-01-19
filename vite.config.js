import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  //開發中  還是產品路徑
  base:process.env.NODE_ENV === 'production' ? '/react-week3/' : '/',
  plugins: [react()],
  server: {
    hmr: false // 禁用熱重載
  }
})
