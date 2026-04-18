import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Link } from "react-router-dom";
import "swiper/css";
import { getImageUrl } from "../utils/getImageUrl";

// icon svg
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

const CategorySlider = ({ categories, activeCategoryId }) => {
  const filtered = categories.filter((c) => c.image_icon);
  const isDetailPage = activeCategoryId !== undefined;

  return (
    <div className="mt-16 px-6 mx-3 md:mx-20 lg:mx-42">
      {!isDetailPage && (
        <h2 className="capitalize text-xl font-semibold mb-4 text-gray-900">
          Kategori Cerita
        </h2>
      )}
      <div className="relative flex items-center w-full">
        {/* Tombol Panah Kiri */}
        <button className="cat-prev absolute -left-6 md:-left-10 top-1/2 -translate-y-1/2 z-20 hover:scale-110 transition cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed">
          <IconArrowLeft />
        </button>

        <div className="w-full flex-1">
          <Swiper
            modules={[Navigation]}
            navigation={{
              nextEl: ".cat-next",
              prevEl: ".cat-prev",
            }}
            slidesPerView={2}
            spaceBetween={16}
            breakpoints={{
              640: { slidesPerView: 3 },
              1024: { slidesPerView: 5 },
            }}
            className="w-full py-6"
          >
            {filtered.map((category) => {
              const isActive =
                isDetailPage && category.id === parseInt(activeCategoryId);

              return (
                <SwiperSlide
                  key={category.id}
                  className={isActive ? "z-10!" : "z-0!"}
                >
                  <div className="p-2">
                    <Link
                      to={`/categories/${category.id}`}
                      className={`block cursor-pointer transition-all duration-300 rounded-2xl relative ${
                        isActive
                          ? "ring-4 ring-[#39E619] ring-offset-[3px] scale-[1.05] shadow-xl"
                          : "hover:scale-105 shadow-sm hover:shadow-md"
                      }`}
                    >
                      <img
                        // gunakan helper
                        src={getImageUrl(category.image_icon)}
                        alt={category.name}
                        draggable="false"
                        className="w-full h-auto object-cover rounded-2xl select-none"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/300x150?text=Kategori";
                        }}
                      />
                    </Link>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

        {/* Tombol Panah Kanan */}
        <button className="cat-next absolute -right-6 md:-right-10 top-1/2 -translate-y-1/2 z-20 hover:scale-110 transition cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed">
          <IconArrowRight />
        </button>
      </div>
    </div>
  );
};

export default CategorySlider;
