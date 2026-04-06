import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const Category = ({ categories }) => {
  const filtered = categories.filter((c) => c.image !== null);

  return (
    <div className="mt-16 px-6 mx-3 md:mx-20 lg:mx-42">
      <h2 className="capitalize text-xl font-semibold mb-4">kategori cerita</h2>

      <Swiper
        modules={[Autoplay]}
        slidesPerView={2}
        spaceBetween={16}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        breakpoints={{
          640: { slidesPerView: 3 },
          1024: { slidesPerView: 5 },
        }}
        className="w-full"
      >
        {filtered.map((category) => (
          <SwiperSlide key={category.id}>
            <div className="cursor-pointer hover:scale-105 transition-transform duration-300">
              <img
                src={`/images/category/${category.image}`}
                alt={category.name}
                className="w-full h-auto object-cover rounded-2xl"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Category;
