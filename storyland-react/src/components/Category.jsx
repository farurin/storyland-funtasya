import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";
import "swiper/css";

const Category = ({ categories, activeCategoryId }) => {
  const filtered = categories.filter((c) => c.image_icon);
  const isDetailPage = activeCategoryId !== undefined;

  return (
    <div className="mt-16 px-6 mx-3 md:mx-20 lg:mx-42">
      {!isDetailPage && (
        <h2 className="capitalize text-xl font-semibold mb-4 text-gray-900">
          Kategori Cerita
        </h2>
      )}

      <Swiper
        modules={[Autoplay]}
        slidesPerView={2}
        spaceBetween={16}
        autoplay={
          isDetailPage ? false : { delay: 5000, disableOnInteraction: false }
        }
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
                    src={`/images/category/${category.image_icon}`}
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
  );
};

export default Category;
