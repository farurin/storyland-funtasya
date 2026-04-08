import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

// icon svg
const IconClose = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IconBookmark = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
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
const IconHeart = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
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

const BookPreviewModal = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const previewId = searchParams.get("preview");
  const navigate = useNavigate();

  // 1. Inisialisasi state buku sebagai null
  const [book, setBook] = useState(null);

  // 2. Perbaiki logika useEffect
  useEffect(() => {
    if (!previewId) {
      // Jika tidak ada ID, kosongkan data tanpa membuat infinite loop
      if (book !== null) setBook(null);
      return;
    }

    // Jika ada ID, ambil dari database
    fetch("http://localhost:5000/api/books")
      .then((res) => res.json())
      .then((data) => {
        const foundBook = data.find((b) => b.id === parseInt(previewId));
        setBook(foundBook);
      })
      .catch((err) => console.error(err));
  }, [previewId]); // Hanya peduli pada perubahan ID di URL

  // 3. Jangan merender pop-up jika tidak ada ID atau data buku
  if (!previewId || !book) return null;

  const closeModal = () => {
    searchParams.delete("preview");
    setSearchParams(searchParams);
  };

  const handleReadClick = () => {
    closeModal();
    navigate(`/book/${book.id}`);
  };

  return (
    // Overlay Hitam Transparan
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-10 bg-black/70 backdrop-blur-sm">
      {/* Container Modal (Ukuran mengikuti desain Figma) */}
      <div className="relative w-full max-w-4xl aspect-4/3 md:aspect-21/9 bg-black rounded-3xl overflow-hidden shadow-2xl flex">
        {/* Tombol Close di Pojok Kanan Atas */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 md:top-6 md:right-6 text-white/50 hover:text-white z-50 bg-black/20 p-2 rounded-full transition"
        >
          <IconClose />
        </button>

        {/* Gambar Latar Belakang */}
        <img
          src={`/images/books/${book.image}`}
          alt={book.title}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Gradient Hitam dari Kiri */}
        <div className="absolute inset-0 bg-linear-to-r from-black/95 via-black/70 to-transparent flex flex-col justify-center px-6 md:px-12 w-full md:w-2/3">
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
            {book.title}
          </h1>

          <div className="flex flex-wrap items-center gap-2 md:gap-3 text-white/80 text-xs md:text-sm mt-3 font-medium">
            <span>📄 11 Halaman</span>
            <span className="hidden md:inline">|</span>
            <span>📚 {book.category_name || "Cerita Nusantara"}</span>
          </div>

          <div className="flex items-center gap-4 text-white/70 text-xs md:text-sm mt-2">
            <span>👁️ {book.views_count || 0}</span>
            <span>❤️ 114</span>
            <span>🔖 105</span>
          </div>

          <div className="mt-4 md:mt-6">
            <h3 className="text-white font-semibold text-base md:text-lg">
              Sinopsis
            </h3>
            <p className="text-white/80 mt-1 md:mt-2 text-xs md:text-base max-w-xl leading-relaxed line-clamp-3 md:line-clamp-4">
              {book.description || "Sinopsis cerita belum tersedia."}
            </p>
          </div>

          {/* Tombol Aksi */}
          <div className="mt-6 md:mt-8 flex flex-col gap-3 max-w-60">
            <div className="flex gap-3 h-10 md:h-12">
              <button className="w-10 md:w-12 h-full bg-[#FFF3C7] text-gray-900 flex items-center justify-center rounded-xl md:rounded-2xl hover:scale-105 transition shadow-lg">
                <IconBookmark />
              </button>
              <button
                onClick={handleReadClick}
                className="flex-1 bg-[#FFF3C7] text-gray-900 font-bold rounded-xl md:rounded-2xl hover:bg-yellow-100 transition shadow-lg text-sm md:text-base"
              >
                Baca
              </button>
            </div>
            <div className="flex gap-3 h-10 md:h-12">
              <button className="w-10 md:w-12 h-full bg-[#A5F3FF] text-gray-900 flex items-center justify-center rounded-xl md:rounded-2xl hover:scale-105 transition shadow-lg">
                <IconHeart />
              </button>
              <button className="flex-1 bg-[#A5F3FF] text-gray-900 font-bold rounded-xl md:rounded-2xl hover:bg-cyan-100 transition shadow-lg text-sm md:text-base">
                Tonton
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookPreviewModal;
