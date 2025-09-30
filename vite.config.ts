import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  /* 配置开启服务器后的一些必备参数 */
  server:{
    /* 开启服务器之后自动打开浏览器 */
    open:true,
    /* 本地服务器端地址,可以自己配置,这里使用 localhost 表示时刻提醒替自己
    自己链接的服务器就是自己本地 */
    host:'localhost',
    /* 设置端口号 尽量使用 8000 - 9000 之间的端口号 */
    port:8888,
    /* 开启 hmr 模块热加载功能 */
    hmr:true,
},
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
  
})
