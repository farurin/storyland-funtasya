import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import flowbiteReact from "flowbite-react/plugin/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), flowbiteReact()],

  // Akses untuk Cloudinary:
  define: {
    "process.env.CLOUDINARY_URL": JSON.stringify(
      "https://res.cloudinary.com/dsqxxvimn/image/upload/",
    ),
  },
});
