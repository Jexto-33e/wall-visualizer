import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

export default defineConfig({
  plugins: [react(), tailwindcss(), cssInjectedByJsPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  build: {
    rollupOptions: {
      output: {
        format: "iife",
        name: "WallVisualizerBundle",
        manualChunks: undefined,
        entryFileNames: `wall-visualizer.js`,
        chunkFileNames: `wall-visualizer.js`,
        assetFileNames: `wall-visualizer.[ext]`,
      },
    },
  },
});
