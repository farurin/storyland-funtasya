import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// --- IKON SVG ---
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
  const [currentPage, setCurrentPage] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [showNarration, setShowNarration] = useState(true);

  const [language, setLanguage] = useState("id");
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const storyPages = [
    {
      image: "/images/book-scene/malin-kundang/scene-01.png",
      textId:
        "Dahulu kala di perkampungan nelayan Pantai Air Manis, Padang, hiduplah seorang janda bernama Mande Rubayah bersama anak laki-lakinya, Malin Kundang.",
      textEn:
        "A long time ago in the fishing village of Air Manis Beach, Padang, lived a widow named Mande Rubayah with her son, Malin Kundang.",
    },
    {
      image: "/images/book-scene/malin-kundang/scene-02.png",
      textId:
        "Mande Rubayah sangat menyayangi dan memanjakan Malin. Malin pun tumbuh menjadi pemuda yang rajin, kuat, dan selalu membantu ibunya.",
      textEn:
        "Mande Rubayah loved and spoiled Malin very much. Malin grew up to be a diligent, strong young man who always helped his mother.",
    },
    {
      image: "/images/book-scene/malin-kundang/scene-03.png",
      textId:
        "Suatu hari, sebuah kapal besar merapat di pantai. Malin meminta izin kepada ibunya untuk pergi merantau mencari kekayaan agar bisa membahagiakan ibunya.",
      textEn:
        "One day, a large ship docked at the beach. Malin asked his mother for permission to go wandering to seek wealth so he could make her happy.",
    },
    {
      image: "/images/book-scene/malin-kundang/scene-04.png",
      textId:
        "Dengan berat hati, Mande Rubayah mengizinkan. Ia membekali Malin dengan nasi bungkus daun pisang kesukaannya dan melepasnya dengan air mata.",
      textEn:
        "With a heavy heart, Mande Rubayah agreed. She packed his favorite rice wrapped in banana leaves and saw him off with tears.",
    },
    {
      image: "/images/book-scene/malin-kundang/scene-05.png",
      textId:
        "Tahun demi tahun berlalu. Malin bekerja keras di kapal dan beruntung dinikahkan dengan putri saudagar kaya. Ia pun menjadi saudagar sukses dengan banyak kapal dagang.",
      textEn:
        "Years passed. Malin worked hard on the ship and was lucky to marry the daughter of a wealthy merchant. He became a successful merchant with many trading ships.",
    },
    {
      image: "/images/book-scene/malin-kundang/scene-06.png",
      textId:
        "Sementara itu, sang ibu setiap hari menatap ke laut menunggu kepulangan anaknya sambil terus berdoa untuk keselamatan Malin.",
      textEn:
        "Meanwhile, his mother stared at the sea every day waiting for her son's return while constantly praying for Malin's safety.",
    },
    {
      image: "/images/book-scene/malin-kundang/scene-07.png",
      textId:
        "Suatu hari, kapal mewah Malin berlabuh di Pantai Air Manis. Penduduk desa mengenali pemuda tampan berpakaian mewah itu adalah Malin Kundang.",
      textEn:
        "One day, Malin's luxurious ship anchored at Air Manis Beach. The villagers recognized the handsome, lavishly dressed young man as Malin Kundang.",
    },
    {
      image: "/images/book-scene/malin-kundang/scene-08.png",
      textId:
        "Mendengar kabar itu, Mande Rubayah berlari ke pantai dan memeluk Malin erat-erat. 'Malin, anakku! Kau sudah pulang,' ucapnya penuh kerinduan.",
      textEn:
        "Hearing the news, Mande Rubayah ran to the beach and hugged Malin tightly. 'Malin, my son! You are home,' she said full of longing.",
    },
    {
      image: "/images/book-scene/malin-kundang/scene-09.png",
      textId:
        "Namun, melihat ibunya yang berpakaian lusuh, Malin merasa malu pada istri cantiknya. Ia mendorong ibunya dan berkata, 'Wanita gila! Aku tidak punya ibu miskin sepertimu!'",
      textEn:
        "However, seeing his mother in shabby clothes, Malin felt ashamed in front of his beautiful wife. He pushed his mother and said, 'Crazy woman! I don't have a poor mother like you!'",
    },
    {
      image: "/images/book-scene/malin-kundang/scene-10.png",
      textId:
        "Hati Mande Rubayah hancur lebur. Sambil menangis, ia menengadahkan tangan ke langit dan berdoa, 'Ya Tuhan, jika ia benar anakku Malin, kutuklah ia menjadi batu!'",
      textEn:
        "Mande Rubayah's heart was shattered. Crying, she raised her hands to the sky and prayed, 'Oh God, if he is truly my son Malin, curse him into a stone!'",
    },
    {
      image: "/images/book-scene/malin-kundang/scene-11.png",
      textId:
        "Tiba-tiba badai besar datang menghancurkan kapal Malin. Tubuh Malin perlahan kaku dan akhirnya berubah menjadi bongkahan batu yang bersujud di tepi pantai.",
      textEn:
        "Suddenly a huge storm came and destroyed Malin's ship. Malin's body slowly stiffened and eventually turned into a boulder kneeling on the beach.",
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
      <div className="w-full aspect-video bg-gray-100 rounded-none animate-pulse shadow-lg border border-gray-200"></div>
    );
  }

  const changeLanguage = (lang) => {
    setLanguage(lang);
    setIsLangMenuOpen(false);
  };

  return (
    // container
    <div className="relative w-full aspect-video mx-auto bg-black rounded-none overflow-hidden shadow-2xl group transition-all duration-500">
      <img
        src={storyPages[currentPage].image}
        alt={`Halaman ${currentPage + 1}`}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
        onError={(e) => {
          e.target.src =
            "https://via.placeholder.com/1280x720?text=Scene+Cerita";
        }}
      />

      {/* navigasi & progres atas */}
      <div className="absolute top-0 left-0 right-0 p-5 md:p-8 flex items-center justify-between bg-linear-to-b from-black/40 to-transparent z-10">
        {/* tombol back kiri atas */}
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 md:w-12.5 md:h-12.5 bg-[#FDECA2] rounded-full flex items-center justify-center hover:scale-105 transition shadow-md text-gray-900"
        >
          <IconBackCurved />
        </button>

        <div className="flex-1 mx-5 md:mx-8 flex gap-1.5 md:gap-2">
          {storyPages.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 md:h-2 rounded-full flex-1 transition-all duration-300 ${
                index <= currentPage ? "bg-[#FFF8E1]" : "bg-white/40"
              }`}
            />
          ))}
        </div>

        <div className="relative">
          {/* tombol globe/bahasa */}
          <button
            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
            className="w-10 h-10 md:w-12.5 md:h-12.5 bg-[#FDECA2] rounded-full flex items-center justify-center hover:scale-105 transition shadow-md font-bold text-gray-900 border-2 border-white/20"
          >
            <IconGlobe />
          </button>

          {/* Menu Dropdown */}
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

      {/* narasi dan kontrol */}
      <div
        className={`absolute bottom-6 md:bottom-10 left-0 right-0 px-4 md:px-10 transition-transform duration-500 ${
          showNarration
            ? "translate-y-0"
            : "translate-y-40 opacity-0 pointer-events-none"
        }`}
      >
        {/* Kontainer Flex, Items Center */}
        <div className="flex items-center justify-center mx-auto w-full max-w-345">
          {/* 4. tombol prev */}
          <button
            onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
            className="w-11.25 h-11.25 md:w-[58.38px] md:h-[56.47px] shrink-0 bg-[#FDECA2] text-black rounded-full flex items-center justify-center disabled:opacity-50 hover:scale-105 transition shadow-lg relative z-10 -mr-6 md:-mr-8"
          >
            <div className="rotate-180">
              <IconTriangle />
            </div>
          </button>

          {/* kotak narasi */}
          <div className="w-full max-w-315.5 bg-[#FFF8E1] rounded-[40px] px-12 py-4 md:px-24 md:py-5 shadow-xl relative flex items-center justify-center min-h-17.5 md:min-h-21.25 z-0">
            {/* Tombol Auto & Close */}
            <div className="absolute -top-4 right-8 md:right-10 flex gap-2 z-20">
              <button
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                className={`px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 shadow-md transition ${
                  isAutoPlay
                    ? "bg-[#FDECA2] text-black border border-yellow-400"
                    : "bg-[#FDECA2] text-black"
                }`}
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

            {/* teks narasi */}
            <p className="text-black font-semibold text-sm md:text-[20px] text-center leading-relaxed md:leading-normal">
              {language === "id"
                ? storyPages[currentPage].textId
                : storyPages[currentPage].textEn}
            </p>
          </div>

          {/* tombol next */}
          <button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(storyPages.length - 1, prev + 1),
              )
            }
            disabled={currentPage === storyPages.length - 1}
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
