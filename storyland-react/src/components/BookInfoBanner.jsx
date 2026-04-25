import React from "react";
import { getImageUrl } from "../utils/getImageUrl";

// icon svg
const IconPages = () => (
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
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);
const IconCategory = () => (
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
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);
const IconViews = () => (
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
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const IconHeart = () => (
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
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const IconBookmark = () => (
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
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);

const BookInfoBanner = ({ book, totalPages = 11 }) => {
  if (!book) {
    return (
      <div className="w-full bg-[#E9E9FF] rounded-4xl p-6 md:p-8 flex flex-col md:flex-row gap-6 animate-pulse mt-4 mb-16">
        <div className="w-30 md:w-40.75 h-45 md:h-58 bg-purple-200 rounded-2xl shrink-0 self-center md:self-start"></div>
        <div className="ml-0 md:ml-4 flex-1 py-4 w-full">
          <div className="h-8 bg-purple-200 rounded w-1/3 mb-4"></div>
          <div className="h-10 bg-purple-200 rounded w-2/3 mb-6"></div>
          <div className="h-4 bg-purple-200 rounded w-1/2 mb-4"></div>
          <div className="h-20 bg-purple-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  // warna kategori, fallback ungu jika kosong
  const catColor = book.category_color || "#6B4EFF";

  return (
    <div className="w-full bg-[#E9E9FF] rounded-4xl p-6 md:p-8 flex flex-col md:flex-row gap-5 md:gap-8 items-start mt-4 mb-16 shadow-sm border border-white/50">
      <div className="w-30 md:w-40.75 shrink-0 self-center md:self-start">
        <div className="w-full h-45 md:h-58 rounded-2xl overflow-hidden shadow-lg border-[3px] border-white/80 bg-gray-200">
          <img
            src={getImageUrl(book.image)}
            alt={book.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/163x232?text=Cover+Buku";
            }}
          />
        </div>
      </div>

      {/* KANAN: Detail Informasi */}
      <div className="flex-1 py-1 md:py-2 flex flex-col justify-center">
        <h4 className="text-[#6B4EFF] font-bold text-2xl md:text-[30px] mb-2 md:mb-3 leading-none">
          Sedang Membaca..
        </h4>
        <h1 className="text-3xl md:text-[40px] font-extrabold text-black tracking-tight mb-4 leading-tight">
          {book.title}
        </h1>

        <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm font-medium text-gray-800 mb-2">
          <div className="flex items-center gap-1.5">
            <IconPages />
            <span>{totalPages} Halaman</span>
          </div>
          <span className="text-gray-400">|</span>

          {/* WARNA KATEGORI DITERAPKAN DI SINI (DESAIN LAMA) */}
          <div
            className="flex items-center gap-1.5 font-bold"
            style={{ color: catColor }}
          >
            <IconCategory />
            <span>{book.category_name || "Kategori"}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm font-medium text-gray-800 mb-5">
          <div className="flex items-center gap-1.5">
            <IconViews />
            <span>{book.views_count || 0}</span>
          </div>
          <div className="flex items-center gap-1.5 text-pink-500">
            <IconHeart />
            <span>114</span>
          </div>
          <div className="flex items-center gap-1.5 text-purple-500">
            <IconBookmark />
            <span>105</span>
          </div>
        </div>

        <div>
          <h5 className="font-bold text-black text-sm md:text-base mb-1.5">
            Sinopsis
          </h5>
          <p className="text-gray-700 leading-relaxed text-xs md:text-sm lg:text-base max-w-4xl">
            {book.description || "Sinopsis belum tersedia untuk cerita ini."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookInfoBanner;
