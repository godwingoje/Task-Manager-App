import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  root: "apps/frontend",
  envDir: "../..",
  plugins: [tailwindcss()],
});