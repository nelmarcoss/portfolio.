import { defineConfig } from "vite";
export default defineConfig({
  root: "tramo",
  base: "/tramo/",
  build: { outDir: "../dist/tramo", emptyOutDir: true },
  server: { port: 5173 },
});
