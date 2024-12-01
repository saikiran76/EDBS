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
    server: {
      port: Number(envVars.VITE_APP_PORT || 3000),
      open: true,
    },
    envDir: "../",
    build: {
      outDir: "build",
      rollupOptions: {
        external: [
          'pica', 
          'lodash.throttle', 
          'canvas-roundrect-polyfill',
          'workbox-build',
          'workbox-window'
        ],
        output: {
          manualChunks: {
            'excalidraw-assets': ['../packages/excalidraw/index.ts']
          }
        }
      },
      sourcemap: true,
      assetsInlineLimit: 0,
    },
    plugins: [
      Sitemap({
        hostname: "https://excalidraw.com",
        outDir: "build",
        changefreq: "monthly",
        generateRobotsTxt: false,
      }),
      woff2BrowserPlugin(),
      react(),
      checker({
        typescript: true,
        eslint:
          envVars.VITE_APP_ENABLE_ESLINT === "false"
            ? undefined
            : { lintCommand: 'eslint "./**/*.{js,ts,tsx}"' },
        overlay: {
          initialIsOpen: envVars.VITE_APP_COLLAPSE_OVERLAY === "false",
          badgeStyle: "margin-bottom: 4rem; margin-left: 1rem",
        },
      }),
      svgrPlugin(),
      ViteEjsPlugin(),
      VitePWA({
        registerType: "autoUpdate",
        devOptions: {
          enabled: envVars.VITE_APP_ENABLE_PWA === "true",
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,woff2,png}']
        }
      }),
      createHtmlPlugin({
        minify: true,
      }),
    ],
    publicDir: "../public",
  };
});
