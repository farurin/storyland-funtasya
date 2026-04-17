import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Card from "./Card";
import { Button } from "flowbite-react";
import bannerImg from "../assets/banner.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ActionPopupModal from "./ActionPopupModal"; // Pastikan import modal-nya

// Icon SVG
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

const BANNER_AFTER_INDEX = 2;

// Komponen BannerIklan
const BannerIklan = ({ latestBook }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
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
            <Button
              onClick={() => setIsModalOpen(true)}
              className="capitalize bg-[#A454FF] text-white font-semibold rounded-full px-10 shadow-md hover:bg-purple-700 transition border-none focus:ring-0"
            >
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

      {/* Render Modal jika latestBook tersedia */}
      {latestBook && (
        <ActionPopupModal
          isOpen={isModalOpen}
          image={`/images/books/${latestBook.image}`}
          title="BUKU BARU!"
          description={`Ada buku baru untukmu: "${latestBook.title}". Buku ini sudah siap kamu baca. Selamat menikmati!`}
          primaryBtnText="Lihat"
          primaryBtnColor="bg-[#852BFA] hover:bg-purple-700"
          secondaryBtnText="Tutup"
          onPrimaryClick={() => {
            setIsModalOpen(false);
            navigate(`${location.pathname}?preview=${latestBook.id}`);
          }}
          onSecondaryClick={() => setIsModalOpen(false)}
        />
      )}
    </section>
  );
};

export const CategorySection = ({ category, customTitle }) => {
  const booksToShow = category.books ? category.books.slice(0, 6) : [];

  return (
    <div className="mt-10 mb-6">
      {/* Header Section */}
      <div className="flex items-end justify-between mb-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">
            {customTitle ? customTitle : category.name}
          </h3>
          {!customTitle && (
            <p className="text-gray-500 text-sm mt-1">{category.description}</p>
          )}
        </div>
        <Link
          to={`/categories/${category.id}`}
          className="text-[#8131F3] text-sm font-semibold hover:underline mb-1"
        >
          Lihat Semua
        </Link>
      </div>

      {/* Pembungkus Relative */}
      <div className="relative flex items-start">
        {/* Tombol Kiri */}
        <button
          className={`swiper-prev-${category.id} absolute -left-8 md:-left-12 top-[127.5px] -translate-y-1/2 z-10 hover:scale-110 transition cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed`}
        >
          <IconArrowLeft />
        </button>

        <div className="flex gap-5 items-start h-full w-full">
          {/* Banner Sticky Kiri */}
          <Link
            to={`/categories/${category.id}`}
            className="hidden lg:block w-33.25 h-63.75 shrink-0 relative group overflow-hidden rounded-2xl shadow-sm bg-gray-100"
          >
            <img
              src={`/images/category/${category.image_banner}`}
              alt={category.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/133x255?text=Banner+Kategori";
              }}
            />
          </Link>

          {/* Area Swiper */}
          <div className="flex-1 min-w-0 custom-list-swiper relative">
            {booksToShow.length > 0 ? (
              <Swiper
                modules={[Pagination, Navigation]}
                navigation={{
                  prevEl: `.swiper-prev-${category.id}`,
                  nextEl: `.swiper-next-${category.id}`,
                }}
                slidesPerView="auto"
                spaceBetween={20}
                pagination={{ clickable: true }}
                className="pb-10"
              >
                {booksToShow.map((book) => (
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

        {/* Tombol Kanan */}
        <button
          className={`swiper-next-${category.id} absolute -right-8 md:-right-12 top-[127.5px] -translate-y-1/2 z-10 hover:scale-110 transition cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed`}
        >
          <IconArrowRight />
        </button>
      </div>
    </div>
  );
};

const BookListSection = ({ data }) => {
  const filtered = data.filter((c) => c.image !== null);

  const allBooks = data.flatMap((category) => category.books || []);
  const latestBook =
    allBooks.length > 0 ? allBooks.sort((a, b) => b.id - a.id)[0] : null;

  return (
    <section className="mx-3 md:mx-20 lg:mx-42 px-6">
      {filtered.map((category, index) => (
        <React.Fragment key={category.id}>
          <CategorySection category={category} />
          {/* Kirim buku terbaru ke komponen BannerIklan */}
          {index === BANNER_AFTER_INDEX && (
            <BannerIklan latestBook={latestBook} />
          )}
        </React.Fragment>
      ))}
    </section>
  );
};

export default BookListSection;
