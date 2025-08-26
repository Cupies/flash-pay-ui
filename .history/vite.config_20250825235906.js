import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import path from 'path';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    vue(),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/icons/svg')],
      symbolId: 'icon-[dir]-[name]',
      svgoOptions: {
        plugins: [
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
      '@': path.resolve(__dirname, 'src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 全局导入 Sass 内置模块
        additionalData: `
          @use 'sass:color';
          @use 'sass:math';
        `,
        // 正确配置 sassOptions（与 additionalData 同级）
        sassOptions: {
          silenceDeprecations: ['legacy-js-api'], // 临时禁用警告
        }
      },
    },
  },
});