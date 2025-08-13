import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

// ESM-safe __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to client folder
const clientRoot = path.resolve(__dirname, "client");

export default defineConfig({
  root: clientRoot,
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(clientRoot, "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  build: {
    outDir: path.resolve(__dirname, "dist"), // ✅ match firebase.json
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      allow: [clientRoot],
      deny: ["**/.*"],
    },
  },
});
