import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import svgrPlugin from "vite-plugin-svgr";
import { ViteEjsPlugin } from "vite-plugin-ejs";
import { VitePWA } from "vite-plugin-pwa";
import { createHtmlPlugin } from "vite-plugin-html";
import Sitemap from "vite-plugin-sitemap";
import { woff2BrowserPlugin } from "../scripts/woff2/woff2-vite-plugins";
import path from "path";

export default defineConfig(({ mode }) => {
  const envVars = loadEnv(mode, `../`);
  
  return {
    root: __dirname,
    base: "./",
    resolve: {
      alias: {
        '@excalidraw/excalidraw': path.resolve(__dirname, '../packages/excalidraw/src/index.ts'),
      }
    },
    build: {
      outDir: "build",
      assetsDir: "assets",
      rollupOptions: {
        input: {
          app: path.resolve(__dirname, 'index.html')
        },
        external: [
          'pica', 
          'lodash.throttle', 
          'path2d-polyfill',
        ],
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          }
        }
      }
    },
    plugins: [
      react(),
      svgrPlugin(),
      ViteEjsPlugin(),
      woff2BrowserPlugin(),
      VitePWA({
        registerType: "autoUpdate",
        devOptions: {
          enabled: envVars.VITE_APP_ENABLE_PWA === "true",
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}']
        }
      }),
      createHtmlPlugin({
        minify: true,
        inject: {
          data: {
            title: 'Excalidraw'
          }
        }
      })
    ],
    optimizeDeps: {
      include: ['react', 'react-dom']
    }
  };
});
