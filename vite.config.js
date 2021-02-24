import vue from '@vitejs/plugin-vue'
import {
  defineConfig
} from 'vite'
import path from 'path'
import {
  viteMockServe
} from 'vite-plugin-mock';

// https://vitejs.dev/config/
export default defineConfig(({
  command
}) => {
  return {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        'view': path.resolve(__dirname, 'src/view'),
        'comp': path.resolve(__dirname, 'src/components'),
        'api': path.resolve(__dirname, 'src/api'),
        'router': path.resolve(__dirname, 'src/router'),
        'store': path.resolve(__dirname, 'src/store'),
        'plugin': path.resolve(__dirname, 'src/plugin'),
        'style': path.resolve(__dirname, 'src/style'),
        'util': path.resolve(__dirname, 'src/util')
      }
    },
    plugins: [
      vue(),
      viteMockServe({
        supportTs: false,
        // default
        mockPath: 'mock',
        localEnabled: command === 'serve'
      }),
    ],
  };
});