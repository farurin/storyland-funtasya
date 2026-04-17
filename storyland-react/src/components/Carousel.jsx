import React, { useState, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import Card from "./Card";

// Icon SVG
const IconLike = () => (
  <div className="bg-white/30 p-1.5 rounded-full flex items-center justify-center shrink-0">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="text-white"
    >
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
    </svg>
  </div>
);
const IconFire = () => (
  <div className="bg-white/30 p-1.5 rounded-full flex items-center justify-center shrink-0">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="text-white"
    >
      <path d="M12 22C6.477 22 2 17.523 2 12c0-4.478 3.158-8.23 7.5-9.613.56-.178 1.096.34 1.01.916-.145.975-.125 2.15.534 3.057.48.567 1.22.905 2.015.892 1.458-.024 2.85-.79 3.513-2.072.28-.544 1.08-.432 1.25.158A9.972 9.972 0 0 1 22 12c0 5.523-4.477 10-10 10Zm-2-7a2 2 0 1 0 4 0c0-1.105-.895-2-2-2s-2 .895-2 2Z" />
    </svg>
  </div>
);
const IconStar = () => (
  <div className="bg-white/30 p-1.5 rounded-full flex items-center justify-center shrink-0">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="text-white"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  </div>
);
const IconArrowLeft = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="#852BFA"
    stroke="#852BFA"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 5 L7 12 L15 19 Z" />
  </svg>
);
const IconArrowRight = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="#852BFA"
    stroke="#852BFA"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 5 L17 12 L9 19 Z" />
  </svg>
);

// Main components
const Carousel = ({ books }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const categoriesData = useMemo(
    () => [
      {
        id: 0,
        label: "Rekomendasi",
        activeColor: "#5179DE",
        inactiveColor: "#90AFFF",
        icon: <IconLike />,
        items: books.slice(0, 6),
      },
      {
        id: 1,
        label: "Populer",
        activeColor: "#D9587C",
        inactiveColor: "#FF8EAE",
        icon: <IconFire />,
        items: books.slice(6, 12),
      },
      {
        id: 2,
        label: "Terbaru",
        activeColor: "#D58B09",
        inactiveColor: "#F8AF2F",
        icon: <IconStar />,
        items: books.slice(12, 18),
      },
    ],
    [books],
  );

  const listToDisplay = useMemo(() => {
    if (searchQuery) {
      return books.filter((book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    return categoriesData[activeTab].items;
  }, [searchQuery, books, activeTab, categoriesData]);

  return (
    <section className="bg-[#F1F1FF] pt-12 pb-8 mt-12 w-full">
      <div className="mx-3 md:mx-20 lg:mx-42 px-6 custom-swiper-container relative">
        {/* BAGIAN ATAS: TAB & PENCARIAN */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-8">
          {searchQuery ? (
            <div className="flex justify-center xl:justify-start items-center w-full">
              <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 text-center xl:text-left">
                Hasil Pencarian:{" "}
                <span className="text-[#8B5CF6]">"{searchQuery}"</span>
              </h2>
            </div>
          ) : (
            // flex-col untuk Mobile (menumpuk), flex-row untuk Desktop
            <div className="flex flex-col md:flex-row items-center justify-center xl:justify-start gap-4 w-full xl:w-auto">
              {categoriesData.map((cat) => {
                const isActive = activeTab === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveTab(cat.id)}
                    style={{
                      backgroundColor: isActive
                        ? cat.activeColor
                        : cat.inactiveColor,
                    }}
                    className={`cursor-pointer flex flex-row items-center justify-center md:justify-start gap-3 w-48 md:w-auto text-white pl-2 pr-5 py-2 rounded-full text-sm font-bold transition-all duration-300 shadow-sm focus:outline-none 
                      ${isActive ? "opacity-100 scale-105" : "hover:opacity-90"}
                    `}
                  >
                    {cat.icon}
                    <span className="whitespace-nowrap">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Kolom Pencarian */}
          <div className="relative w-full md:w-80 xl:w-96 shrink-0 mx-auto xl:mx-0">
            <input
              type="text"
              placeholder="Cari judul cerita..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-6 pr-12 py-3 rounded-full border border-white focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm text-gray-600 placeholder-gray-400 shadow-sm bg-white"
            />
            <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
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
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
          </div>
        </div>

        {/* BAGIAN BAWAH: SLIDER BUKU */}
        <div className="relative flex items-center h-auto">
          {listToDisplay.length > 0 ? (
            <>
              {/* Panah kiri */}
              <button className="carousel-prev absolute -left-8 md:-left-12 top-1/2 -translate-y-1/2 z-10 hover:scale-110 transition cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed">
                <IconArrowLeft />
              </button>

              <div className="flex-1 min-w-0 w-full relative">
                <Swiper
                  key={searchQuery ? "search" : `tab-${activeTab}`}
                  modules={[Autoplay, Navigation]}
                  navigation={{
                    prevEl: ".carousel-prev",
                    nextEl: ".carousel-next",
                  }}
                  slidesPerView="auto"
                  spaceBetween={20}
                  autoplay={
                    searchQuery
                      ? false
                      : { delay: 3500, disableOnInteraction: false }
                  }
                  className="w-full py-6! px-2"
                >
                  {listToDisplay.map((book) => (
                    <SwiperSlide key={book.id} style={{ width: "179px" }}>
                      <div className="transition-transform duration-300 hover:scale-105 cursor-pointer h-full">
                        <Card book={book} />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              {/* Panah kanan */}
              <button className="carousel-next absolute -right-8 md:-right-12 top-1/2 -translate-y-1/2 z-10 hover:scale-110 transition cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed">
                <IconArrowRight />
              </button>
            </>
          ) : (
            <div className="w-full h-63.75 flex items-center justify-center bg-white rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 font-medium">
              {searchQuery
                ? "Pencarian tidak ditemukan."
                : "Tidak ada buku di kategori ini."}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Carousel;
