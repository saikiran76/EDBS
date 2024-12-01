import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import svgrPlugin from "vite-plugin-svgr";
import { ViteEjsPlugin } from "vite-plugin-ejs";
import { VitePWA } from "vite-plugin-pwa";
import checker from "vite-plugin-checker";
import { createHtmlPlugin } from "vite-plugin-html";
import Sitemap from "vite-plugin-sitemap";
import { woff2BrowserPlugin } from "../scripts/woff2/woff2-vite-plugins";
import path from "path";

export default defineConfig(({ mode }) => {
  const envVars = loadEnv(mode, `../`);
  
  return {
    resolve: {
      alias: {
        '@excalidraw/excalidraw': path.resolve(__dirname, '../packages/excalidraw/index.ts'),
      }
    },
    build: {
      outDir: "build",
      rollupOptions: {
        external: ['pica', 'lodash.throttle', 'path2d-polyfill'],
        output: {
          manualChunks: {
            'excalidraw-assets': ['../packages/excalidraw/index.ts']
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
        }
      }),
      createHtmlPlugin({
        minify: true,
      })
    ]
  };
});
