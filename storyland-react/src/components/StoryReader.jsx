import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getBookPages, finishBook, updateProgress } from "../services/api";
import { getImageUrl } from "../utils/getImageUrl";

// Icon SVG
const IconBackCurved = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z" />
  </svg>
);
const IconGlobe = () => (
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
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    <path d="M2 12h20" />
  </svg>
);
const IconTriangle = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M8 5v14l11-7z" />
  </svg>
);
const IconAutoPlay = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="5 4 15 12 5 20 5 4" fill="currentColor" />
    <line x1="19" y1="5" x2="19" y2="19" />
  </svg>
);
const IconClose = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const StoryReader = ({ book }) => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [currentPage, setCurrentPage] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [showNarration, setShowNarration] = useState(true);

  const [language, setLanguage] = useState("id");
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const [pages, setPages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasFinished, setHasFinished] = useState(false);

  // Reference untuk objek Audio agar bisa di-stop/play kapan saja
  const audioRef = useRef(new Audio());

  // FETCH PAGES
  useEffect(() => {
    if (!book) return;

    const fetchPages = async () => {
      setIsLoading(true);
      try {
        const data = await getBookPages(book.id);
        setPages(data);
        setCurrentPage(0);
        setHasFinished(false);
      } catch (err) {
        console.error("Error fetching pages:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPages();

    // Simpan referensi DOM ke variabel lokal
    const audioNode = audioRef.current;

    // Cleanup: Matikan audio jika komponen ditutup/ditinggalkan
    return () => {
      audioNode.pause();
      audioNode.src = "";
    };
  }, [book]);

  // IMAGE PRELOADING
  // Fungsi ini berjalan diam-diam setiap kali halaman berganti
  useEffect(() => {
    if (pages.length === 0) return;

    // 1. Preload (download diam-diam) gambar halaman BERICUTNYA
    if (currentPage < pages.length - 1) {
      const nextImage = new Image();
      nextImage.src = getImageUrl(pages[currentPage + 1].image);
    }

    // 2. Preload gambar halaman SEBELUMNYA (jika user ingin mundur)
    if (currentPage > 0) {
      const prevImage = new Image();
      prevImage.src = getImageUrl(pages[currentPage - 1].image);
    }
  }, [currentPage, pages]);

  // LOGIKA AUDIO (DUBBING) DYNAMIC
  useEffect(() => {
    // Jika data halaman belum ada atau kotak teks disembunyikan, hentikan audio
    if (pages.length === 0 || !showNarration) {
      audioRef.current.pause();
      return;
    }

    const currentPageData = pages[currentPage];

    // Tentukan dubbing mana yang harus diputar berdasarkan bahasa saat ini
    const dubbingUrl =
      language === "id"
        ? currentPageData.dubbing_id_url
        : currentPageData.dubbing_en_url;

    // Hentikan audio sebelumnya
    audioRef.current.pause();

    // Jika ada dubbing baru, mainkan
    if (dubbingUrl) {
      audioRef.current.src = getImageUrl(dubbingUrl);

      // Tambahkan catch error agar browser tidak spam console jika autoplay diblokir
      audioRef.current
        .play()
        .catch((err) => console.log("Auto-play prevented by browser: ", err));
    }
  }, [currentPage, language, showNarration, pages]); // Effect berjalan tiap kali ganti halaman, ganti bahasa, atau teks dimunculkan/disembunyikan

  // LOGIKA PROGRESS UPDATE (SILENT)
  useEffect(() => {
    if (pages.length > 0 && token && currentPage < pages.length - 1) {
      const currentPercentage = Math.round(
        ((currentPage + 1) / pages.length) * 100,
      );
      updateProgress(book.id, currentPercentage, token).catch((err) =>
        console.error("Silent Progress Update Error:", err),
      );
    }
  }, [currentPage, pages.length, token, book]);

  // LOGIKA FINISH BUKU (SILENT)
  useEffect(() => {
    if (
      pages.length > 0 &&
      currentPage === pages.length - 1 &&
      !hasFinished &&
      token
    ) {
      setHasFinished(true);
      finishBook(book.id, token)
        .then(() => console.log("Silent Trigger: Buku selesai dibaca!"))
        .catch((err) => console.error("Silent Trigger Error:", err));
    }
  }, [currentPage, pages.length, hasFinished, token, book]);

  // LOGIKA AUTOPLAY
  useEffect(() => {
    let interval;
    if (isAutoPlay && pages.length > 0) {
      // set durasi autoplay 12 detik
      interval = setInterval(() => {
        if (currentPage < pages.length - 1) {
          setCurrentPage((prev) => prev + 1);
        } else {
          setIsAutoPlay(false);
        }
      }, 12000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlay, currentPage, pages.length]);

  // HANDLER GANTI BAHASA
  const changeLanguage = (lang) => {
    setLanguage(lang);
    setIsLangMenuOpen(false);
  };

  // LOADING / EMPTY STATE UI
  if (!book || isLoading) {
    return (
      <div className="w-full aspect-video bg-gray-100 rounded-4xl animate-pulse shadow-lg border border-gray-200"></div>
    );
  }

  if (pages.length === 0) {
    return (
      <div className="w-full aspect-video bg-gray-200 rounded-4xl flex flex-col items-center justify-center shadow-lg border border-gray-300">
        <IconGlobe className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-600 mb-2">
          Halaman Belum Tersedia
        </h2>
        <p className="text-gray-500">
          Cerita ini sedang dalam tahap ilustrasi.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 px-6 py-2 bg-[#FDECA2] text-black font-bold rounded-full hover:bg-yellow-300 transition"
        >
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div
      id="story-reader-container"
      className="relative w-full aspect-video mx-auto bg-black overflow-hidden shadow-2xl group transition-all duration-500 rounded-2xl md:rounded-[40px]"
    >
      {/* GAMBAR BACKGROUND SCENE */}
      <img
        src={getImageUrl(pages[currentPage].image)}
        alt={`Halaman ${currentPage + 1}`}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
        onError={(e) => {
          e.target.src =
            "https://via.placeholder.com/1280x720?text=Scene+Cerita";
        }}
      />

      {/* HEADER CONTROLS */}
      <div className="absolute top-0 left-0 right-0 p-5 md:p-8 flex items-center justify-between bg-linear-to-b from-black/40 to-transparent z-10">
        {/* Tombol Back */}
        <button
          onClick={() => {
            if (document.fullscreenElement) {
              document.exitFullscreen();
            } else {
              navigate(-1);
            }
          }}
          className="w-10 h-10 md:w-12.5 md:h-12.5 bg-[#FDECA2] rounded-full flex items-center justify-center hover:scale-105 transition shadow-md text-gray-900 cursor-pointer"
        >
          <IconBackCurved />
        </button>

        {/* Progress Bar Halaman */}
        <div className="flex-1 mx-5 md:mx-8 flex gap-1.5 md:gap-2">
          {pages.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 md:h-2 rounded-full flex-1 transition-all duration-300 ${index <= currentPage ? "bg-[#FFF8E1]" : "bg-white/40"}`}
            />
          ))}
        </div>

        {/* Tombol Toggle Bahasa (Bilingual) */}
        <div className="relative">
          <button
            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
            className="w-10 h-10 md:w-12.5 md:h-12.5 bg-[#FDECA2] rounded-full flex items-center justify-center hover:scale-105 transition shadow-md font-bold text-gray-900 border-2 border-white/20 cursor-pointer"
          >
            <IconGlobe />
          </button>

          {isLangMenuOpen && (
            <div className="absolute right-0 mt-3 w-40 bg-[#FFF9E5] rounded-2xl shadow-xl overflow-hidden border border-yellow-200 z-50">
              <button
                onClick={() => changeLanguage("id")}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-yellow-100 transition text-gray-800 font-semibold border-b border-yellow-200/50 cursor-pointer"
              >
                <span className="text-xl">🇮🇩</span> Indonesia
              </button>
              <button
                onClick={() => changeLanguage("en")}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-yellow-100 transition text-gray-800 font-semibold cursor-pointer"
              >
                <span className="text-xl">🇬🇧</span> English
              </button>
            </div>
          )}
        </div>
      </div>

      {/* KOTAK NARASI (TEXT & DUBBING) */}
      <div
        className={`absolute bottom-6 md:bottom-10 left-0 right-0 px-4 md:px-10 transition-transform duration-500 ${showNarration ? "translate-y-0" : "translate-y-40 opacity-0 pointer-events-none"}`}
      >
        <div className="flex items-center justify-center mx-auto w-full max-w-[90%] md:max-w-4xl">
          {/* Tombol Prev */}
          <button
            onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
            className="w-12 h-12 md:w-16 md:h-16 shrink-0 bg-[#FDECA2] text-black rounded-full flex items-center justify-center disabled:opacity-50 hover:scale-105 transition shadow-lg relative z-10 -mr-6 md:-mr-8 cursor-pointer"
          >
            <div className="rotate-180">
              <IconTriangle />
            </div>
          </button>

          {/* Text Container */}
          <div className="w-full bg-[#FFF8E1] rounded-[40px] px-10 py-5 md:px-24 md:py-8 shadow-xl relative flex items-center justify-center min-h-25 z-0">
            {/* AutoPlay & Close Buttons */}
            <div className="absolute -top-5 right-6 md:right-10 flex gap-2 z-20">
              <button
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-md transition cursor-pointer ${isAutoPlay ? "bg-[#FDECA2] text-black border-2 border-yellow-400" : "bg-[#FDECA2] text-black"}`}
              >
                Auto <IconAutoPlay />
              </button>
              <button
                onClick={() => setShowNarration(false)}
                className="w-9 h-9 md:w-10 md:h-10 bg-[#FDECA2] rounded-full flex items-center justify-center text-black shadow-md hover:bg-yellow-200 cursor-pointer"
              >
                <IconClose />
              </button>
            </div>

            {/* Dynamic Text (ID/EN) */}
            <p className="text-black font-semibold text-sm md:text-xl text-center leading-relaxed">
              {language === "id"
                ? pages[currentPage].text_id
                : pages[currentPage].text_en ||
                  "English translation not available yet."}
            </p>
          </div>

          {/* Tombol Next */}
          <button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.max(0, Math.min(pages.length - 1, prev + 1)),
              )
            }
            disabled={currentPage === pages.length - 1}
            className="w-12 h-12 md:w-16 md:h-16 shrink-0 bg-[#FDECA2] text-black rounded-full flex items-center justify-center disabled:opacity-50 hover:scale-105 transition shadow-lg relative z-10 -ml-6 md:-ml-8 cursor-pointer"
          >
            <IconTriangle />
          </button>
        </div>
      </div>

      {/* Tombol Munculkan Teks (Jika disembunyikan) */}
      {!showNarration && (
        <button
          onClick={() => setShowNarration(true)}
          className="absolute bottom-6 right-8 px-5 py-3 bg-[#FDECA2] text-gray-900 rounded-full font-bold text-sm shadow-xl hover:scale-105 transition cursor-pointer z-20"
        >
          Munculkan Teks
        </button>
      )}
    </div>
  );
};

export default StoryReader;
