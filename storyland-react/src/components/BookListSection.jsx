import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Card from "./Card";
import { Button } from "flowbite-react";
import bannerImg from "../assets/banner.png";
import { Link } from "react-router-dom";

const BANNER_AFTER_INDEX = 2;

const BannerIklan = () => (
  <section className="w-full my-16">
    <div className="flex flex-col-reverse lg:flex-row items-center gap-10 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
      <div className="w-full lg:w-1/2 text-center lg:text-left">
        <h1 className="text-black font-bold text-3xl md:text-4xl leading-tight">
          Pengumuman
        </h1>
        <p className="text-gray-600 mt-4 text-sm md:text-base max-w-md mx-auto lg:mx-0">
          Banyak kisah menarik menunggu untuk kamu jelajahi. Temukan cerita
          favoritmu sekarang.
        </p>
        <div className="mt-6 flex justify-center lg:justify-start">
          <Button className="capitalize bg-[#A454FF] text-white font-semibold rounded-full px-10 shadow-md hover:bg-purple-700 transition border-none focus:ring-0">
            cek sekarang
          </Button>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex justify-center">
        <img
          src={bannerImg}
          alt="Banner Illustration"
          className="w-full max-w-sm md:max-w-md lg:max-w-xl object-contain"
        />
      </div>
    </div>
  </section>
);

export const CategorySection = ({ category, customTitle }) => (
  <div className="mt-12 mb-20">
    {/* Header Section */}
    <div className="flex items-end justify-between mb-4">
      <div>
        {/* Jika ada customTitle, gunakan itu. Jika tidak, gunakan nama kategori bawaan */}
        <h3 className="text-2xl font-bold text-gray-900">
          {customTitle ? customTitle : category.name}
        </h3>
        {/* Sembunyikan deskripsi jika sedang menggunakan customTitle (di halaman detail buku) */}
        {!customTitle && (
          <p className="text-gray-500 text-sm mt-1">{category.description}</p>
        )}
      </div>
      <Link
        to={`/categories/${category.id}`}
        className="text-purple-500 text-sm font-semibold hover:underline mb-1"
      >
        Lihat Semua
      </Link>
    </div>

    <div className="flex gap-5 items-start h-full">
      <Link
        to={`/categories/${category.id}`}
        className="hidden lg:block w-33.25 h-63.75 shrink-0 relative group overflow-hidden rounded-2xl shadow-sm bg-gray-100"
      >
        <img
          src={`/images/category/${category.image_banner}`}
          alt={category.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/133x255?text=Banner+Kategori";
          }}
        />
        <div className="absolute bottom-3 left-0 right-0 flex justify-center px-2">
          <div className="bg-white/90 backdrop-blur-sm text-[#F59E0B] text-[10px] font-bold py-1.5 px-3 rounded-full shadow-sm whitespace-nowrap">
            Lihat Semua &gt;
          </div>
        </div>
      </Link>

      <div className="flex-1 min-w-0 custom-list-swiper relative">
        {category.books && category.books.length > 0 ? (
          <Swiper
            modules={[Pagination, Autoplay]}
            slidesPerView="auto"
            spaceBetween={20}
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            className="pb-12"
          >
            {category.books.map((book) => (
              <SwiperSlide key={book.id} style={{ width: "179px" }}>
                <div className="w-44.75 h-63.75 transition-transform duration-300 hover:scale-105">
                  <Card book={book} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="flex items-center justify-center h-63.75 text-gray-400 italic">
            Belum ada buku di kategori ini.
          </div>
        )}
      </div>
    </div>
  </div>
);

// ... (KODE BookListSection DI BAWAHNYA TETAP SAMA) ...

const BookListSection = ({ data }) => {
  const filtered = data.filter((c) => c.image !== null);

  return (
    <section className="mx-3 md:mx-20 lg:mx-42 px-6">
      {filtered.map((category, index) => (
        <React.Fragment key={category.id}>
          <CategorySection category={category} />
          {index === BANNER_AFTER_INDEX && <BannerIklan />}
        </React.Fragment>
      ))}

      {/* CSS untuk titik pagination yang hilang */}
      <style jsx global>{`
        .custom-list-swiper .swiper-pagination {
          bottom: 0px !important;
        }
        .custom-list-swiper .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: #a454ff !important;
          opacity: 0.3;
          margin: 0 5px !important;
        }
        .custom-list-swiper .swiper-pagination-bullet-active {
          opacity: 1;
        }
      `}</style>
    </section>
  );
};

export default BookListSection;
