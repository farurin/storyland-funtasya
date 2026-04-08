import React from "react";
import { Link, useLocation } from "react-router-dom";

// Icon svg
const IconClock = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconBookmark = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z" />
  </svg>
);

// Warna berdasarkan nama kategori
const categoryColors = {
  "Cerita Mancanegara": "#7A5AF8",
  "Cerita Nusantara": "#E37500",
  "Cerita Anak Tauladan": "#FF628E",
  "Kisah Nabi & Rosul": "#34D62D",
  "Cerita Hewan": "#5B99CE",
  "Pahlawan Nusantara": "#FBB3AB",
  "Cerita Anak Muslim": "#A8F4E2",
  "Kisah 1001 Malam": "#EDC095",
};

const SavedCard = ({ book }) => {
  const location = useLocation();
  if (!book) return null;

  // Menentukan warna kategori, default ke abu-abu jika tidak ditemukan di daftar
  const catColor = categoryColors[book.category_name] || "#6B4EFF";

  return (
    // Kontainer Utama: Flexbox baris (kiri-kanan)
    <div className="w-full bg-[#EBE9FF] rounded-3xl p-5 flex gap-5 transition-transform hover:scale-[1.02] shadow-sm hover:shadow-md border border-white/50">
      {/* KIRI: Cover Buku */}
      <div className="w-28 md:w-32 shrink-0 aspect-2/3 rounded-2xl overflow-hidden shadow-sm bg-gray-200">
        <img
          src={`/images/books/${book.image}`}
          alt={book.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/150x220?text=Cover";
          }}
        />
      </div>

      {/* KANAN: Container Flexbox Kolom (Atas-Bawah) */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* ATAS: Judul dan Info */}
        <div className="flex-1">
          {/* Judul: line-clamp-1 untuk mencegah judul panjang merusak layout */}
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-3 truncate">
            {book.title}
          </h3>

          {/* Baris 1: Kategori & Views */}
          <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm font-semibold mb-2">
            <span style={{ color: catColor }}>
              # {book.category_name || "Kategori"}
            </span>
            <span className="text-[#6B4EFF]/40">•</span>
            <span className="text-[#6B4EFF]">
              Dibaca {book.views_count || 0} kali
            </span>
          </div>

          {/* Baris 2: Waktu & Tanggal Simpan */}
          <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm font-medium text-[#6B4EFF]/80">
            <span className="flex items-center gap-1.5">
              <IconClock /> 5min
            </span>
            <span className="text-[#6B4EFF]/40">•</span>
            <span className="flex items-center gap-1.5">
              <IconBookmark /> Disimpan 2 hari lalu
            </span>
          </div>
        </div>

        {/* TENGAH: Garis Pembatas */}
        <div className="w-full h-px bg-[#6B4EFF]/15 my-3"></div>

        {/* BAWAH: Tombol Baca */}
        <div className="flex justify-end mt-auto">
          <Link
            to={`${location.pathname}?preview=${book.id}`}
            className="bg-[#6B4EFF] text-white px-7 py-2 rounded-full font-bold text-sm hover:bg-purple-700 transition shadow-md whitespace-nowrap"
          >
            Baca
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SavedCard;
