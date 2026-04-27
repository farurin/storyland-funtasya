// 1. Import gambar dari folder assets untuk fallback
import fallbackImage from "../assets/lovecat.png";

export const getImageUrl = (imagePath) => {
  // 2. Fallback jika data kosong dari database, kembalikan gambar lovecat.png
  if (!imagePath) return fallbackImage;

  // 3. Jika imagePath sudah berupa URL penuh (misal foto profil Google), kembalikan aslinya
  if (imagePath.startsWith("http") || imagePath.startsWith("https")) {
    // Perbaikan: Ubah karakter '&' menjadi '%26' agar valid di URL
    return imagePath.replace(/&/g, "%26");
  }

  // 4. Memotong path untuk mengambil nama filenya saja
  // Contoh: "/images/avatar/profilava-1.png" -> dipotong -> "profilava-1.png"
  const fileName = imagePath.split("/").pop();

  // Perbaikan: Ubah karakter '&' menjadi '%26' pada nama file sebelum digabung ke URL Cloudinary
  const safeFileName = fileName.replace(/&/g, "%26");

  // 5. Gabungkan URL Cloudinary dari vite.config.js dengan nama file.
  // eslint-disable-next-line no-undef
  const cloudinaryBase = process.env.CLOUDINARY_URL;

  return `${cloudinaryBase}${safeFileName}`;
};
