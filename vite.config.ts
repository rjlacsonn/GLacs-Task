import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["glacs-icon-192.png", "glacs-icon-512.png"],
      manifest: {
        name: "GLacs",
        short_name: "GLacs",
        description: "AI productivity app for tasks, schedules, and reminders",
        theme_color: "#111827",
        background_color: "#f9fafb",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "glacs-icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "glacs-icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "glacs-icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
});