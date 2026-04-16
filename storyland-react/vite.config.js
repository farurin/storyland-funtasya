import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  define: {
    "process.env.CLOUDINARY_URL": JSON.stringify(
      "https://res.cloudinary.com/dsqxxvimn/image/upload/",
    ),
  },
});
