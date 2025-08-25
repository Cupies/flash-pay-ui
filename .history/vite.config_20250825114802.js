import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import path from 'path';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
     createSvgIconsPlugin({
      // 指定 SVG 文件目录（与你现有 `src/icons/svg` 对应）
      iconDirs: [path.resolve(process.cwd(), 'src/icons/svg')],
      // 指定 symbolId 格式
      symbolId: 'icon-[dir]-[name]',
        svgoOptions: {
        plugins: [
          // 移除 SVG 中的 fill 属性，便于通过 CSS 控制颜色
          { name: 'removeAttrs', params: { attrs: 'fill' } }
        ]
      }
    })
  ],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});