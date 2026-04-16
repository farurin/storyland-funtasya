import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getBookPages, finishBook, updateProgress } from "../services/api";

// icon svg
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
  }, [book]);

  // Logika trigger selesai baca (Silent Trigger)
  useEffect(() => {
    if (
      pages.length > 0 &&
      currentPage === pages.length - 1 &&
      !hasFinished &&
      token
    ) {
      setHasFinished(true);

      // Memanggil fungsi finishBook dari api.js
      finishBook(book.id, token)
        .then(() =>
          console.log("Silent Trigger: Buku selesai dibaca! Misi di-update."),
        )
        .catch((err) => console.error("Silent Trigger Error:", err));
    }
  }, [currentPage, pages.length, hasFinished, token, book]);

  // Logika update progres ke backend setiap kali ganti halaman
  useEffect(() => {
    if (pages.length > 0 && token && currentPage < pages.length - 1) {
      const currentPercentage = Math.round(
        ((currentPage + 1) / pages.length) * 100,
      );
      updateProgress(book.id, currentPercentage, token).catch((err) =>
        console.error("Silent Progress Update Error:", err),
      );
    }
  }, [currentPage, pages.length, token, book.id]);

  // Logika Autoplay
  useEffect(() => {
    let interval;
    if (isAutoPlay && pages.length > 0) {
      interval = setInterval(() => {
        if (currentPage < pages.length - 1) {
          setCurrentPage((prev) => prev + 1);
        } else {
          setIsAutoPlay(false);
        }
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlay, currentPage, pages.length]);

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

  const changeLanguage = (lang) => {
    setLanguage(lang);
    setIsLangMenuOpen(false);
  };

  return (
    <div
      id="story-reader-container"
      className="relative w-full aspect-video mx-auto bg-black overflow-hidden shadow-2xl group transition-all duration-500 rounded-2xl md:rounded-[40px]"
    >
      <img
        src={pages[currentPage].image}
        alt={`Halaman ${currentPage + 1}`}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
        onError={(e) => {
          e.target.src =
            "https://via.placeholder.com/1280x720?text=Scene+Cerita";
        }}
      />

      <div className="absolute top-0 left-0 right-0 p-5 md:p-8 flex items-center justify-between bg-linear-to-b from-black/40 to-transparent z-10">
        <button
          onClick={() => {
            // Cek apakah sedang dalam mode layar penuh
            if (document.fullscreenElement) {
              document.exitFullscreen(); // Jika iya, keluar dari layar penuh saja
            } else {
              navigate(-1); // Jika tidak, baru kembali ke halaman sebelumnya
            }
          }}
          className="w-10 h-10 md:w-12.5 md:h-12.5 bg-[#FDECA2] rounded-full flex items-center justify-center hover:scale-105 transition shadow-md text-gray-900"
        >
          <IconBackCurved />
        </button>

        <div className="flex-1 mx-5 md:mx-8 flex gap-1.5 md:gap-2">
          {pages.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 md:h-2 rounded-full flex-1 transition-all duration-300 ${index <= currentPage ? "bg-[#FFF8E1]" : "bg-white/40"}`}
            />
          ))}
        </div>

        <div className="relative">
          <button
            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
            className="w-10 h-10 md:w-12.5 md:h-12.5 bg-[#FDECA2] rounded-full flex items-center justify-center hover:scale-105 transition shadow-md font-bold text-gray-900 border-2 border-white/20"
          >
            <IconGlobe />
          </button>

          {isLangMenuOpen && (
            <div className="absolute right-0 mt-3 w-40 bg-[#FFF9E5] rounded-2xl shadow-xl overflow-hidden border border-yellow-200 z-50">
              <button
                onClick={() => changeLanguage("id")}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-yellow-100 transition text-gray-800 font-semibold border-b border-yellow-200/50"
              >
                <span className="text-xl">🇮🇩</span> Indonesia
              </button>
              <button
                onClick={() => changeLanguage("en")}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-yellow-100 transition text-gray-800 font-semibold"
              >
                <span className="text-xl">🇬🇧</span> English
              </button>
            </div>
          )}
        </div>
      </div>

      <div
        className={`absolute bottom-6 md:bottom-10 left-0 right-0 px-4 md:px-10 transition-transform duration-500 ${showNarration ? "translate-y-0" : "translate-y-40 opacity-0 pointer-events-none"}`}
      >
        <div className="flex items-center justify-center mx-auto w-full max-w-345">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
            className="w-11.25 h-11.25 md:w-[58.38px] md:h-[56.47px] shrink-0 bg-[#FDECA2] text-black rounded-full flex items-center justify-center disabled:opacity-50 hover:scale-105 transition shadow-lg relative z-10 -mr-6 md:-mr-8"
          >
            <div className="rotate-180">
              <IconTriangle />
            </div>
          </button>

          <div className="w-full max-w-315.5 bg-[#FFF8E1] rounded-[40px] px-12 py-4 md:px-24 md:py-5 shadow-xl relative flex items-center justify-center min-h-17.5 md:min-h-21.25 z-0">
            <div className="absolute -top-4 right-8 md:right-10 flex gap-2 z-20">
              <button
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                className={`px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 shadow-md transition ${isAutoPlay ? "bg-[#FDECA2] text-black border border-yellow-400" : "bg-[#FDECA2] text-black"}`}
              >
                Auto <IconAutoPlay />
              </button>
              <button
                onClick={() => setShowNarration(false)}
                className="w-8 h-8 bg-[#FDECA2] rounded-full flex items-center justify-center text-black shadow-md hover:bg-yellow-200"
              >
                <IconClose />
              </button>
            </div>

            <p className="text-black font-semibold text-sm md:text-[20px] text-center leading-relaxed md:leading-normal">
              {language === "id"
                ? pages[currentPage].text_id
                : pages[currentPage].text_en}
            </p>
          </div>

          <button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.max(0, Math.min(pages.length - 1, prev + 1)),
              )
            }
            disabled={currentPage === pages.length - 1}
            className="w-11.25 h-11.25 md:w-[58.38px] md:h-[56.47px] shrink-0 bg-[#FDECA2] text-black rounded-full flex items-center justify-center disabled:opacity-50 hover:scale-105 transition shadow-lg relative z-10 -ml-6 md:-ml-8"
          >
            <IconTriangle />
          </button>
        </div>
      </div>

      {!showNarration && (
        <button
          onClick={() => setShowNarration(true)}
          className="absolute bottom-6 right-8 px-4 py-2 bg-[#FDECA2] text-gray-900 rounded-full font-bold text-xs md:text-sm shadow-xl hover:scale-105 transition"
        >
          Munculkan Teks
        </button>
      )}
    </div>
  );
};

export default StoryReader;
