import React from "react";

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
  // Jika data buku belum dimuat, tampilkan rangka loading
  if (!book) {
    return (
      <div className="w-full bg-[#E9E9FF] rounded-4xl p-6 md:p-8 flex animate-pulse h-64 mt-4 mb-16">
        <div className="w-32 md:w-48 bg-purple-200 rounded-2xl h-full shrink-0"></div>
        <div className="ml-6 md:ml-10 flex-1 py-4">
          <div className="h-6 bg-purple-200 rounded w-1/3 mb-4"></div>
          <div className="h-10 bg-purple-200 rounded w-2/3 mb-6"></div>
          <div className="h-4 bg-purple-200 rounded w-1/2 mb-4"></div>
          <div className="h-20 bg-purple-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#E9E9FF] rounded-4xl p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-10 items-start mt-4 mb-16">
      {/* KIRI: Cover Buku */}
      <div className="w-40 md:w-52 shrink-0 self-center md:self-start">
        <div className="w-full aspect-2/3 rounded-2xl overflow-hidden shadow-lg border-4 border-white/50">
          <img
            src={`/images/books/${book.image}`}
            alt={book.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/200x300?text=Cover+Buku";
            }}
          />
        </div>
      </div>

      {/* KANAN: Detail Informasi */}
      <div className="flex-1 py-2 md:py-4">
        <h4 className="text-[#6B4EFF] font-bold text-xl md:text-2xl mb-1">
          Sedang Membaca..
        </h4>
        <h1 className="text-3xl md:text-5xl font-extrabold text-black tracking-tight mb-4">
          {book.title}
        </h1>

        {/* Baris Meta Info (Halaman & Kategori) */}
        <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-800 mb-2">
          <div className="flex items-center gap-1.5">
            <IconPages />
            <span>{totalPages} Halaman</span>
          </div>
          <span className="text-gray-400">|</span>
          <div className="flex items-center gap-1.5">
            <IconCategory />
            <span>{book.category_name || "Kategori"}</span>
          </div>
        </div>

        {/* Baris Statistik (Views, Likes, Saves) */}
        <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-800 mb-6">
          <div className="flex items-center gap-1.5">
            <IconViews />
            <span>{book.views_count || 0}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <IconHeart />
            <span>114</span> {/* Angka dummy statis sesuai desain Figma */}
          </div>
          <div className="flex items-center gap-1.5">
            <IconBookmark />
            <span>105</span> {/* Angka dummy statis sesuai desain Figma */}
          </div>
        </div>

        {/* Sinopsis */}
        <div>
          <h5 className="font-bold text-black text-base md:text-lg mb-2">
            Sinopsis
          </h5>
          <p className="text-gray-700 leading-relaxed text-sm md:text-base max-w-4xl">
            {book.description || "Sinopsis belum tersedia untuk cerita ini."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookInfoBanner;
