import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Icon SVG
const IconBack = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);
const IconGlobe = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
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
const IconPlay = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M5 3l14 9-14 9V3z" />
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
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const StoryReader = ({ book }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [showNarration, setShowNarration] = useState(true);
  const [language, setLanguage] = useState("id");

  const storyPages = [
    {
      image: "/images/books/1-cerita-nusantara/1malinkundang.png",
      textId:
        "Di sebuah desa kecil di pesisir pantai Sumatera, hiduplah seorang ibu dan anaknya bernama Malin Kundang. Ibu Malin adalah seorang janda yang sangat menyayangi anaknya.",
      textEn:
        "In a small village on the coast of Sumatra, lived a mother and her son named Malin Kundang. Malin's mother was a widow who loved her son very much.",
    },
    {
      image: "/images/books/1-cerita-nusantara/1malinkundang.png",
      textId:
        "Malin tumbuh menjadi pemuda yang kuat, namun ia merasa bosan dengan kemiskinan di desanya dan meminta izin untuk merantau.",
      textEn:
        "Malin grew into a strong young man, but he felt bored with the poverty in his village and asked permission to wander.",
    },
    {
      image: "/images/books/1-cerita-nusantara/1malinkundang.png",
      textId:
        "Bertahun-tahun berlalu, Malin berhasil menjadi saudagar kaya raya dan menikah dengan seorang putri bangsawan.",
      textEn:
        "Years passed, Malin succeeded in becoming a wealthy merchant and married a noble princess.",
    },
  ];

  useEffect(() => {
    let interval;
    if (isAutoPlay) {
      interval = setInterval(() => {
        if (currentPage < storyPages.length - 1) {
          setCurrentPage((prev) => prev + 1);
        } else {
          setIsAutoPlay(false);
        }
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlay, currentPage, storyPages.length]);

  if (!book) {
    return (
      <div className="w-full aspect-video bg-gray-100 rounded-3xl animate-pulse shadow-lg border border-gray-200"></div>
    );
  }

  return (
    <div className="relative w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl group transition-all duration-500">
      <img
        src={storyPages[currentPage].image}
        alt={`Halaman ${currentPage + 1}`}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
      />

      <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex items-center justify-between bg-linear-to-b from-black/50 to-transparent z-10">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 md:w-10 md:h-10 bg-[#FFF3C7] rounded-full flex items-center justify-center hover:scale-105 transition shadow-md text-gray-900"
        >
          <IconBack />
        </button>

        <div className="flex-1 mx-4 md:mx-6 flex gap-1.5 md:gap-2">
          {storyPages.map((_, index) => (
            <div
              key={index}
              className={`h-1 md:h-1.5 rounded-full flex-1 transition-all duration-300 ${
                index <= currentPage ? "bg-[#FFF3C7]" : "bg-white/30"
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => setLanguage((lang) => (lang === "id" ? "en" : "id"))}
          className="w-8 h-8 md:w-10 md:h-10 bg-[#FFF3C7] rounded-full flex items-center justify-center hover:scale-105 transition shadow-md font-bold text-gray-900"
          title="Ganti Bahasa Cerita"
        >
          <IconGlobe />
        </button>
      </div>

      <div
        className={`absolute bottom-4 md:bottom-6 left-0 right-0 px-4 md:px-12 lg:px-24 transition-transform duration-500 ${
          showNarration
            ? "translate-y-0"
            : "translate-y-32 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-3 md:gap-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
            className="w-8 md:w-10 h-8 md:h-10 shrink-0 bg-[#FFF3C7] text-gray-900 rounded-full flex items-center justify-center disabled:opacity-50 hover:scale-105 transition shadow-lg"
          >
            <div className="rotate-180">
              <IconPlay />
            </div>
          </button>
          <div className="flex-1 bg-[#FFF3C7] rounded-2xl md:rounded-3xl p-3 md:p-5 shadow-xl relative min-h-17.5 md:min-h-22.5 flex items-center justify-center">
            <div className="absolute -top-3 right-4 flex gap-1.5 md:gap-2">
              <button
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                className={`px-2.5 py-1 rounded-full text-[10px] md:text-xs font-bold flex items-center gap-1 shadow-md transition ${
                  isAutoPlay
                    ? "bg-purple-500 text-white"
                    : "bg-white text-gray-800"
                }`}
              >
                Auto <IconPlay />
              </button>
              <button
                onClick={() => setShowNarration(false)}
                className="w-5 h-5 md:w-6 md:h-6 bg-white rounded-full flex items-center justify-center text-gray-800 shadow-md hover:bg-red-100"
              >
                <IconClose />
              </button>
            </div>

            <p className="text-gray-900 font-medium text-xs md:text-sm lg:text-base text-center leading-relaxed">
              {language === "id"
                ? storyPages[currentPage].textId
                : storyPages[currentPage].textEn}
            </p>
          </div>

          <button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(storyPages.length - 1, prev + 1),
              )
            }
            disabled={currentPage === storyPages.length - 1}
            className="w-8 md:w-10 h-8 md:h-10 shrink-0 bg-[#FFF3C7] text-gray-900 rounded-full flex items-center justify-center disabled:opacity-50 hover:scale-105 transition shadow-lg"
          >
            <IconPlay />
          </button>
        </div>
      </div>

      {!showNarration && (
        <button
          onClick={() => setShowNarration(true)}
          className="absolute bottom-4 right-4 md:bottom-6 md:right-6 px-3 py-1.5 md:px-4 md:py-2 bg-[#FFF3C7] text-gray-900 rounded-full font-bold text-[10px] md:text-xs shadow-xl hover:scale-105 transition"
        >
          Munculkan Teks
        </button>
      )}
    </div>
  );
};

export default StoryReader;
