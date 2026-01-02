// import swc from 'unplugin-swc'
import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'

export default defineConfig({
  plugins: [
    // swc.vite({
    //   jsc: {
    //     parser: {
    //       syntax: 'typescript',
    //       tsx: false,
    //       decorators: true,
    //     },
    //     transform: {
    //       react: undefined,
    //     },
    //   },
    // }),
    solidPlugin({
      babel: {
        plugins: [
          ['@babel/plugin-proposal-decorators', { legacy: true }],
          ['@babel/plugin-proposal-class-properties', { loose: true }],
        ],
      },
    }),
  ],
  optimizeDeps: {
    include: ['reflect-metadata'],
  },
})
