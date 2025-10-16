import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 這裡是最關鍵的設定！
  // 請將 '/chat1/' 換成您的 GitHub 倉庫名稱
  base: '/chat1/'
})
