import React, { useState, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

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

const Carousel = ({ books }) => {
  const [activeTab, setActiveTab] = useState(0);

  const categoriesData = useMemo(
    () => [
      {
        id: 0,
        label: "Rekomendasi",
        color: "#FF8D9F",
        icon: <IconLike />,
        items: books.slice(0, 6),
      },
      {
        id: 1,
        label: "Populer",
        color: "#FFB545",
        icon: <IconFire />,
        items: books.slice(6, 12),
      },
      {
        id: 2,
        label: "Terbaru",
        color: "#70A9FF",
        icon: <IconStar />,
        items: books.slice(12, 18),
      },
    ],
    [books],
  );

  // filteredBooks
  const displayedBooks = categoriesData[activeTab].items;

  return (
    <section className="mx-3 md:mx-20 lg:mx-42 px-6 mt-16 custom-swiper-container">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-8">
        {/* TAB BUTTONS */}
        <div className="flex flex-wrap items-center gap-4">
          {categoriesData.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              style={{ backgroundColor: cat.color }}
              className={`flex flex-row items-center gap-3 text-white pl-2 pr-5 py-2 rounded-full text-sm font-bold transition shadow-sm focus:outline-none 
                ${activeTab === cat.id ? "ring-4 ring-offset-2 opacity-100 scale-105" : "opacity-60 hover:opacity-80"}
              `}
            >
              {cat.icon}
              <span className="whitespace-nowrap">{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Search Bar (Dibuat statis/tidak berfungsi sementara) */}
        <div className="relative w-full xl:w-96 shrink-0">
          <input
            type="text"
            placeholder="Cari judul, kategori..."
            readOnly
            className="w-full pl-6 pr-12 py-3 rounded-full border border-gray-200 focus:outline-none text-sm text-gray-600 placeholder-gray-400 shadow-sm bg-gray-50 cursor-not-allowed"
            title="Fitur pencarian sedang dalam tahap pengembangan"
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

      {/* SLIDER BUKU */}
      <div className="relative min-h-75">
        {displayedBooks.length > 0 ? (
          <Swiper
            key={activeTab} // Hanya perlu re-render saat tab berubah
            modules={[Pagination, Autoplay]}
            slidesPerView="auto"
            spaceBetween={20}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            className="w-full custom-carousel-swiper"
          >
            {displayedBooks.map((book) => (
              <SwiperSlide key={book.id} style={{ width: "179px" }}>
                <div className="w-44.75 h-63.75 transition-transform duration-300 hover:scale-105 cursor-pointer">
                  <Card book={book} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="w-full h-40 flex items-center justify-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 font-medium">
            Tidak ada buku di kategori ini.
          </div>
        )}
      </div>

      <style jsx global>{`
        /* CSS untuk Pagination Swiper */
        .custom-carousel-swiper {
          padding-top: 15px !important;
          padding-bottom: 50px !important;
        }
        .custom-carousel-swiper .swiper-pagination {
          position: absolute;
          bottom: 0px !important;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
        }
        .custom-carousel-swiper .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: #a454ff !important;
          opacity: 0.3;
          margin: 0 6px !important;
          display: inline-block;
        }
        .custom-carousel-swiper .swiper-pagination-bullet-active {
          opacity: 1;
        }
      `}</style>
    </section>
  );
};

export default Carousel;
