import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: projectRoot,
  publicDir: path.join(projectRoot, "public"),
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": projectRoot,
    },
  },
  build: {
    outDir: path.join(projectRoot, "dist"),
    emptyOutDir: true,
    // Copy public assets (including hidden files such as .htaccess) into dist/.
    copyPublicDir: true,
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
  },
});
