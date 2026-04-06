import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import { Button } from "flowbite-react";
import Card from "./Card";

const Carousel = ({ books, onChangeCategory, onSearch }) => {
  return (
    <section className="mx-3 md:mx-20 lg:mx-42 px-6 mt-16">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* filter category */}
        <div className="flex items-center gap-3">
          <Button onClick={() => onChangeCategory(1)}>Rekomendasi</Button>
          <Button onClick={() => onChangeCategory(2)} color="light">
            Populer
          </Button>
          <Button onClick={() => onChangeCategory(3)} color="light">
            Terbaru
          </Button>
        </div>

        {/* search book */}
        <div className="w-full md:w-72">
          <input
            type="text"
            placeholder="Cari judul buku..."
            onChange={(e) => onSearch(e.target.value)}
            className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none"
          />
        </div>
      </div>

      {/* carousel */}
      <Swiper
        modules={[Pagination, Autoplay]}
        slidesPerView={2}
        spaceBetween={16}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        breakpoints={{
          640: { slidesPerView: 3 },
          1024: { slidesPerView: 6 },
        }}
        className="w-full mt-8 pb-10"
      >
        {/* if book > 0 show book */}
        {books.length > 0 ? (
          books.map((book) => (
            <SwiperSlide key={book.id} className="flex justify-center">
              <Card book={book} />
            </SwiperSlide>
          ))
        ) : (
          // else show not found
          <div className="col-span-full text-center text-gray-500">
            Buku tidak ditemukan dalam kategori
          </div>
        )}
      </Swiper>
    </section>
  );
};

export default Carousel;
