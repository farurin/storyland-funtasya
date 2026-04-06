import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Card from "./Card";
import { Button } from "flowbite-react";
import bannerImg from "../assets/banner.png";

const BANNER_AFTER_INDEX = 2;

const BannerIklan = () => (
  <section className="w-full my-10">
    <div className="flex flex-col-reverse lg:flex-row items-center gap-10 ">
      <div className="w-full lg:w-1/2 text-center lg:text-left">
        <h1 className="text-black font-bold text-3xl md:text-4xl leading-tight">
          Pengumuman
        </h1>
        <p className="text-gray-600 mt-4 text-sm md:text-base max-w-md mx-auto lg:mx-0">
          Banyak kisah menarik menunggu untuk kamu jelajahi. Temukan cerita
          favoritmu sekarang.
        </p>
        <div className="mt-6 flex justify-center lg:justify-start">
          <Button className="capitalize bg-[#A454FF] text-white font-semibold rounded-full px-10 shadow-md hover:shadow-lg transition">
            cek sekarang
          </Button>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex justify-center">
        <img
          src={bannerImg}
          alt="Banner Illustration"
          className="w-full rounded-xl max-w-sm md:max-w-md lg:max-w-xl object-contain"
        />
      </div>
    </div>
  </section>
);

const CategoryCard = ({ category }) => (
  <div className="w-40 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition cursor-pointer">
    {category.image && (
      <img
        src={`/images/category/banner_${category.image}`}
        alt={category.name}
        className="w-full h-56 object-cover"
      />
    )}
  </div>
);

const CategorySection = ({ category }) => (
  <div className="mt-16">
    <div className="flex items-start justify-between mb-1">
      <h3 className="text-xl font-bold">{category.name}</h3>
      <a href="#" className="text-purple-500 text-sm hover:underline">
        Lihat Semua
      </a>
    </div>

    <p className="text-gray-500 text-sm mb-4">{category.description}</p>

    {category.books.length > 0 ? (
      <Swiper
        modules={[Pagination, Autoplay]}
        slidesPerView={2}
        spaceBetween={12}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={category.books.length > 4}
        breakpoints={{
          640: { slidesPerView: 3 },
          1024: { slidesPerView: 6 },
        }}
        className="w-full pb-10"
      >
        <SwiperSlide>
          <CategoryCard category={category} />
        </SwiperSlide>

        {category.books.map((book) => (
          <SwiperSlide key={book.id}>
            {/* Class aspect-[3/4] diganti jadi aspect-3/4 */}
            <div className="cursor-pointer hover:scale-105 transition-transform duration-300 rounded-2xl overflow-hidden aspect-3/4">
              <Card book={book} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    ) : (
      <p className="text-gray-400 text-sm">Belum ada buku di kategori ini.</p>
    )}
  </div>
);

const ListBooks = ({ data }) => {
  const filtered = data.filter((c) => c.image !== null);

  return (
    <section className="mx-3 md:mx-20 lg:mx-42 px-6 md:px-10">
      {filtered.map((category, index) => (
        <React.Fragment key={category.id}>
          <CategorySection category={category} />
          {index === BANNER_AFTER_INDEX && <BannerIklan />}
        </React.Fragment>
      ))}
    </section>
  );
};

export default ListBooks;
