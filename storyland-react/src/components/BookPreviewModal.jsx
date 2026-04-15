import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ActionPopupModal from "./ActionPopupModal";
import {
  getBooks,
  getBookPages,
  getBookStatus,
  toggleFavorite,
  toggleSave,
} from "../services/api";

// icon SVG
const IconBookmark = ({ filled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);
const IconHeart = ({ filled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
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

const BookPreviewModal = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const previewId = searchParams.get("preview");
  const navigate = useNavigate();
  const { token, isLoggedIn, triggerRefresh } = useAuth();

  const [book, setBook] = useState(null);
  const [firstPageImage, setFirstPageImage] = useState(null);

  const [isFavorite, setIsFavorite] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [popupConfig, setPopupConfig] = useState(null);

  useEffect(() => {
    if (!previewId) return;

    const fetchModalData = async () => {
      try {
        const booksData = await getBooks();
        const foundBook = booksData.find((b) => b.id === parseInt(previewId));

        if (foundBook) {
          setBook(foundBook);

          const pagesData = await getBookPages(foundBook.id);
          setFirstPageImage(
            pagesData && pagesData.length > 0 ? pagesData[0].image : null,
          );

          if (isLoggedIn && token) {
            const statusData = await getBookStatus(foundBook.id, token);
            setIsFavorite(statusData.isFavorite);
            setIsSaved(statusData.isSaved);
          }
        }
      } catch (err) {
        console.error("Gagal memuat data modal:", err);
      }
    };
    fetchModalData();
  }, [previewId, isLoggedIn, token]);

  if (!previewId || !book) return null;

  const closeModal = () => {
    searchParams.delete("preview");
    setSearchParams(searchParams);
  };

  const handleReadClick = () => {
    closeModal();
    navigate(`/book/${book.id}`);
  };

  // API trigger
  const executeToggleFavAPI = async () => {
    try {
      const data = await toggleFavorite(book.id, token);
      setIsFavorite(data.isFavorite);
      triggerRefresh();
    } catch (error) {
      console.error(error);
    }
  };

  const executeToggleSaveAPI = async () => {
    try {
      const data = await toggleSave(book.id, token);
      setIsSaved(data.isSaved);
      triggerRefresh();
    } catch (error) {
      console.error(error);
    }
  };

  // handler popup
  const handleToggleFavorite = async () => {
    // guest mode
    if (!isLoggedIn) {
      setPopupConfig({
        image: "/images/popups/popup-fav.png",
        title: "Wah, Rak Favoritmu Masih Kosong!",
        description:
          "Yuk, buat akunmu sekarang supaya semua cerita yang kamu beri tanda hati tetap tersimpan aman untuk dibaca lagi nanti.",
        primaryBtnText: "Buat Akun",
        primaryBtnColor: "bg-[#8B5CF6] hover:bg-purple-700",
        secondaryBtnText: "Nanti Saja",
        onPrimaryClick: () => {
          closeModal();
          navigate("/register"); // Arahkan ke halaman Register
        },
        onSecondaryClick: () => setPopupConfig(null), // Simply close the popup
      });
      return; // Stop execution
    }

    // logged in mode
    if (isFavorite) {
      // Show confirmation before deleting
      setPopupConfig({
        image: "/images/popups/popup-delete-fav.png",
        title: "Hapus dari Favorit",
        description:
          "Setelah dihapus, cerita ini tidak akan ada di daftar favoritmu",
        primaryBtnText: "Hapus",
        primaryBtnColor: "bg-[#8B5CF6] hover:bg-purple-700",
        secondaryBtnText: "Batalkan",
        onPrimaryClick: () => {
          executeToggleFavAPI();
          setPopupConfig(null);
        },
        onSecondaryClick: () => setPopupConfig(null),
      });
    } else {
      // Execute API first, then show success popup
      await executeToggleFavAPI();
      setPopupConfig({
        image: "/images/popups/popup-fav.png",
        title: "Difavoritkan",
        description: "Lihat dan baca cerita yang sudah kamu favoritkan yuk!",
        primaryBtnText: "Lihat",
        primaryBtnColor: "bg-[#8B5CF6] hover:bg-purple-700",
        secondaryBtnText: "Tutup",
        onPrimaryClick: () => {
          closeModal();
          navigate("/corner");
        },
        onSecondaryClick: () => setPopupConfig(null),
      });
    }
  };

  const handleToggleSave = async () => {
    // guest mode
    if (!isLoggedIn) {
      setPopupConfig({
        image: "/images/popups/popup-bookmark.png",
        title: "Rak Bukumu Masih Menunggu!",
        description:
          "Yuk, buat akunmu sekarang supaya semua cerita yang kamu simpan punya tempat yang rapi di rak pribadimu.",
        primaryBtnText: "Buat Akun",
        primaryBtnColor: "bg-[#8B5CF6] hover:bg-purple-700",
        secondaryBtnText: "Nanti Saja",
        onPrimaryClick: () => {
          closeModal();
          navigate("/register"); // Arahkan ke halaman Register
        },
        onSecondaryClick: () => setPopupConfig(null), // Simply close the popup
      });
      return; // Stop execution
    }

    // logged in mode
    if (isSaved) {
      // Execute API directly without popup (no confirmation design)
      await executeToggleSaveAPI();
    } else {
      // Execute API first, then show success popup
      await executeToggleSaveAPI();
      setPopupConfig({
        image: "/images/popups/popup-bookmark.png",
        title: "Berhasil Menyimpan",
        description:
          "Kamu bisa melihat cerita yang sudah kamu simpan di halaman Corner",
        primaryBtnText: "Lihat",
        primaryBtnColor: "bg-[#8B5CF6] hover:bg-purple-700",
        secondaryBtnText: "Tutup",
        onPrimaryClick: () => {
          closeModal();
          navigate("/corner");
        },
        onSecondaryClick: () => setPopupConfig(null),
      });
    }
  };

  const bgImageToUse = firstPageImage
    ? firstPageImage
    : `/images/books/${book.image}`;

  return (
    <>
      <div
        className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-10 bg-black/70 cursor-pointer"
        onClick={closeModal}
      >
        <div
          className="relative w-full max-w-4xl min-h-112.5 md:h-120 bg-black rounded-3xl overflow-hidden shadow-2xl flex cursor-default"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={bgImageToUse}
            alt={book.title}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/800x480?text=Preview+Cerita";
            }}
          />

          <div className="absolute inset-0 bg-linear-to-r from-black/95 via-black/80 to-transparent flex flex-col justify-center px-6 md:px-12 w-full md:w-3/4 lg:w-2/3 py-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight line-clamp-2 pr-4">
              {book.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-white/80 text-xs md:text-sm mt-3 font-medium">
              <span className="flex items-center gap-1.5">
                <IconPages /> 11 Halaman
              </span>
              <span className="hidden md:inline">|</span>
              <span className="flex items-center gap-1.5">
                <IconCategory /> {book.category_name || "Cerita Nusantara"}
              </span>
            </div>

            <div className="flex items-center gap-5 text-white/70 text-xs md:text-sm mt-2">
              <span className="flex items-center gap-1.5">
                <IconViews /> {book.views_count || 0}
              </span>
              <span className="flex items-center gap-1.5 text-pink-400">
                <IconHeart filled={isFavorite} /> 114
              </span>
              <span className="flex items-center gap-1.5 text-[#FFF3C7]">
                <IconBookmark filled={isSaved} /> 105
              </span>
            </div>

            <div className="mt-4 md:mt-6">
              <h3 className="text-white font-semibold text-sm md:text-base">
                Sinopsis
              </h3>
              <p className="text-white/80 mt-1 md:mt-2 text-xs md:text-sm max-w-xl leading-relaxed line-clamp-4 md:line-clamp-5">
                {book.description || "Sinopsis cerita belum tersedia."}
              </p>
            </div>

            <div className="mt-6 md:mt-8 flex flex-col gap-2.5 shrink-0">
              {/* Baris BACA / SIMPAN */}
              <div className="flex gap-2.5 h-9">
                <button
                  onClick={handleToggleSave}
                  className={`w-9 h-full text-gray-900 flex items-center justify-center rounded-full hover:scale-105 transition shadow-lg cursor-pointer ${isSaved ? "bg-yellow-400" : "bg-[#FDECA2] hover:bg-yellow-200"}`}
                >
                  <IconBookmark filled={isSaved} />
                </button>
                <button
                  onClick={handleReadClick}
                  className="w-24 h-full bg-[#FDECA2] text-gray-900 font-bold rounded-full hover:bg-yellow-200 hover:scale-105 transition shadow-lg text-xs md:text-sm cursor-pointer"
                >
                  Baca
                </button>
              </div>

              {/* Baris TONTON / FAVORIT */}
              <div className="flex gap-2.5 h-9">
                <button
                  onClick={handleToggleFavorite}
                  className={`w-9 h-full text-gray-900 flex items-center justify-center rounded-full hover:scale-105 transition shadow-lg cursor-pointer ${isFavorite ? "bg-cyan-400 text-pink-600" : "bg-[#9AF2FF] hover:bg-cyan-200 text-gray-900"}`}
                >
                  <IconHeart filled={isFavorite} />
                </button>
                <button className="w-24 h-full bg-[#9AF2FF] text-gray-900 font-bold rounded-full hover:bg-cyan-200 hover:scale-105 transition shadow-lg text-xs md:text-sm cursor-pointer">
                  Tonton
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Render Popup */}
      <ActionPopupModal isOpen={popupConfig !== null} {...popupConfig} />
    </>
  );
};

export default BookPreviewModal;
