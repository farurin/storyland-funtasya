import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import Card from "./Card";

// Komponen Ikon SVG yang disesuaikan ukurannya (lebih proporsional)
const IconLike = () => (
  <div className="bg-white/30 p-1.5 rounded-full">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="white"
    >
      <path d="M18 10a2 2 0 0 0-2-2h-4V6a3 3 0 0 0-3-3l-4 4v10h9.2a2 2 0 0 0 2-1.6l1.2-6l.6-1.4Z" />
    </svg>
  </div>
);
const IconFire = () => (
  <div className="bg-white/30 p-1.5 rounded-full">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="white"
    >
      <path d="M12 2c0 3.31-2.69 6-6 6c3.31 0 6 2.69 6 6c0-3.31 2.69-6 6-6c-3.31 0-6-2.69-6-6Z" />
    </svg>
  </div>
);
const IconStar = () => (
  <div className="bg-white/30 p-1.5 rounded-full">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="white"
    >
      <path d="M12 1L9 9H1L7 14L5 22L12 17L19 22L17 14L23 9H15L12 1Z" />
    </svg>
  </div>
);

const Carousel = ({ books, onSearch }) => {
  const swiperRef = useRef(null);

  // Membagi buku menjadi 3 kelompok (masing-masing 6 buku)
  // Di dunia nyata, ini diambil berdasarkan id_categories atau flag tertentu
  const categoriesData = [
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
  ];

  const goToSlide = (index) => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideTo(index);
    }
  };

  return (
    <section className="mx-3 md:mx-20 lg:mx-42 px-6 mt-16 custom-swiper-container">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-10">
        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-4">
          {categoriesData.map((cat) => (
            <button
              key={cat.id}
              onClick={() => goToSlide(cat.id)}
              style={{ backgroundColor: cat.color }}
              className="flex items-center gap-3 text-white pl-2 pr-5 py-2 rounded-full text-sm font-bold transition hover:opacity-90 shadow-sm"
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full xl:w-96">
          <input
            type="text"
            placeholder="Search title, categories or keywords"
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-6 pr-12 py-3 rounded-full border border-gray-200 focus:border-purple-400 focus:ring-0 text-sm text-gray-600 placeholder-gray-400 shadow-sm"
          />
          <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400">
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

      {/* Slider: Hanya 3 Slide (Per Kategori) */}
      <div className="pb-12">
        <Swiper
          ref={swiperRef}
          modules={[Pagination, Autoplay]}
          slidesPerView={1} // Satu kategori per slide
          spaceBetween={50}
          pagination={{ clickable: true }}
          className="w-full"
        >
          {categoriesData.map((category) => (
            <SwiperSlide key={category.id}>
              {/* Grid 6 Buku di dalam satu slide kategori */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 px-2">
                {category.items.map((book) => (
                  <div
                    key={book.id}
                    className="flex justify-center transition-transform duration-300 hover:scale-105"
                  >
                    <Card book={book} />
                  </div>
                ))}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx global>{`
        .custom-swiper-container .swiper-pagination-bullet {
          width: 14px;
          height: 14px;
          background: #a454ff !important;
          opacity: 0.3;
          margin: 0 6px !important;
        }
        .custom-swiper-container .swiper-pagination-bullet-active {
          opacity: 1;
        }
      `}</style>
    </section>
  );
};

export default Carousel;
