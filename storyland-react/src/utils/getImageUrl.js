// 1. Import gambar dari folder assets untuk fallback
import fallbackImage from "../assets/lovecat.png";

export const getImageUrl = (imagePath) => {
  // 2. Fallback jika data kosong dari database, kembalikan gambar lovecat.png
  if (!imagePath) return fallbackImage;

  // 3. Jika imagePath sudah berupa URL penuh (misal foto profil Google), kembalikan aslinya
  if (imagePath.startsWith("http") || imagePath.startsWith("https"))
    return imagePath;

  // 4. Memotong path untuk mengambil nama filenya saja
  // Contoh: "/images/avatar/profilava-1.png" -> dipotong -> "profilava-1.png"
  const fileName = imagePath.split("/").pop();

  // 5. Gabungkan URL Cloudinary dari vite.config.js dengan nama file.

  // eslint-disable-next-line no-undef
  const cloudinaryBase = process.env.CLOUDINARY_URL;

  return `${cloudinaryBase}${fileName}`;
};
