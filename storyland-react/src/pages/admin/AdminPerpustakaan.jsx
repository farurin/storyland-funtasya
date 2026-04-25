import React, { useState, useEffect } from "react";
import {
  HiOutlineSearch,
  HiChevronLeft,
  HiChevronRight,
  HiHeart,
  HiChatAlt2,
  HiStar,
  HiDownload,
  HiX,
} from "react-icons/hi";

// IMPORT SWIPER
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";

// IMPORT API & UTILS
import { useAuth } from "../../context/AuthContext";
import {
  getAdminBooks,
  getAdminCategories,
  updateAdminBookStatus,
} from "../../services/api";
import { getImageUrl } from "../../utils/getImageUrl";
import { useAdminToast } from "../../context/AdminToastContext";

import bannerImg from "../../assets/banner_corner.png";

// Ikon Panah Slider
const IconArrowLeft = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="30"
    height="30"
    viewBox="0 0 24 24"
    fill="#F8AF2F"
    stroke="#F8AF2F"
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
    width="30"
    height="30"
    viewBox="0 0 24 24"
    fill="#F8AF2F"
    stroke="#F8AF2F"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 5 L17 12 L9 19 Z" />
  </svg>
);

const AdminPerpustakaan = () => {
  const { token } = useAuth();
  const { showSuccess, showError, showLoading } = useAdminToast();

  // States
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter & Pagination States
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // State untuk Panel Master-Detail
  const [selectedBook, setSelectedBook] = useState(null);

  // FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksData, catsData] = await Promise.all([
          getAdminBooks(token),
          getAdminCategories(token),
        ]);

        const publishedBooks = booksData.filter((b) => b.status === "terbit");
        setBooks(publishedBooks);
        setCategories(catsData.filter((c) => c.image_icon));
      } catch (err) {
        showError("Gagal mengambil data perpustakaan: " + err.message); // TOAST ERROR
      } finally {
        setIsLoading(false);
      }
    };
    if (token) fetchData();
  }, [token, showError]);

  // LOGIKA FILTER
  const filteredBooks = books.filter((book) => {
    const matchSearch = book.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    let matchCategory = false;
    if (activeCategoryId === "all") {
      matchCategory = true;
    } else {
      const matchById = book.id_categories == activeCategoryId;
      const activeCatObj = categories.find((c) => c.id == activeCategoryId);
      const activeCatName = activeCatObj ? activeCatObj.name : "";
      const matchByName = book.category === activeCatName;
      matchCategory = matchById || matchByName;
    }

    return matchSearch && matchCategory;
  });

  // LOGIKA PAGINATION
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const currentBooks = filteredBooks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // HANDLERS UNTUK AKSI
  const handleArchive = async (bookId) => {
    if (!window.confirm("Yakin ingin mengarsipkan buku ini dari publik?"))
      return;

    showLoading(true); // GLOBAL LOADING
    try {
      await updateAdminBookStatus(bookId, "arsip", token);
      setBooks(books.filter((b) => b.id !== bookId));
      setSelectedBook(null);
      showSuccess("Buku berhasil diarsipkan!"); // TOAST SUKSES
    } catch (err) {
      showError("Gagal mengarsipkan: " + err.message); // TOAST ERROR
    } finally {
      showLoading(false); // MATIKAN LOADING
    }
  };

  const handleDelete = async (bookId) => {
    if (!window.confirm("Yakin ingin menghapus buku ini secara permanen?"))
      return;

    showLoading(true); // GLOBAL LOADING
    try {
      await updateAdminBookStatus(bookId, "dihapus", token);
      setBooks(books.filter((b) => b.id !== bookId));
      setSelectedBook(null);
      showSuccess("Buku berhasil dihapus permanen!"); // TOAST SUKSES
    } catch (err) {
      showError("Gagal menghapus: " + err.message); // TOAST ERROR
    } finally {
      showLoading(false); // MATIKAN LOADING
    }
  };

  if (isLoading)
    return (
      <div className="p-12 text-center text-gray-500 font-bold">
        Memuat Perpustakaan...
      </div>
    );

  return (
    <div className="p-6 md:p-10 w-full min-h-screen bg-gray-50 flex flex-col items-center">
      <div className="w-full max-w-350">
        {/* BANNER ATAS */}
        <div className="w-full bg-gray-300 rounded-4xl h-32 md:h-40 mb-8 overflow-hidden relative shadow-sm flex items-center justify-center">
          <img
            src={bannerImg}
            alt="Banner Perpustakaan"
            className="w-full h-full object-cover opacity-80"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          <h2 className="absolute text-2xl md:text-4xl font-black text-gray-800 tracking-wider uppercase">
            Banner
          </h2>
        </div>

        {/* HEADER: TITLE, SEARCH & LANG TOGGLE */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-3xl font-black text-gray-900">Perpustakaan</h1>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Cari Judul, Autor, Kategori..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-white border border-gray-100 rounded-full pl-12 pr-4 py-3 text-sm font-medium shadow-sm outline-none focus:border-[#F8AF2F] transition-all"
              />
            </div>
            <button className="flex items-center gap-2 bg-[#F8AF2F] text-white px-4 py-3 rounded-full font-bold text-sm shadow-sm hover:bg-yellow-500 shrink-0 cursor-pointer">
              <span className="text-lg">🇮🇩</span> IND ▾
            </button>
          </div>
        </div>

        {/* CATEGORY SLIDER */}
        <div className="relative flex items-center w-full mb-8">
          <button className="admin-cat-prev absolute -left-4 md:-left-8 z-20 hover:scale-110 cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed">
            <IconArrowLeft />
          </button>

          <div className="w-full px-2">
            <Swiper
              modules={[Navigation]}
              navigation={{
                nextEl: ".admin-cat-next",
                prevEl: ".admin-cat-prev",
              }}
              slidesPerView={2}
              spaceBetween={16}
              breakpoints={{
                640: { slidesPerView: 3 },
                1024: { slidesPerView: 5 },
                1280: { slidesPerView: 6 },
              }}
              className="py-2"
            >
              {/* Tombol "Semua Kategori" */}
              <SwiperSlide>
                <button
                  onClick={() => {
                    setActiveCategoryId("all");
                    setCurrentPage(1);
                  }}
                  className={`w-full h-15 flex items-center justify-center rounded-2xl font-bold text-sm transition-all border-2 cursor-pointer ${
                    activeCategoryId === "all"
                      ? "bg-[#eaf9e9] text-green-900 border-[#84E280] shadow-md scale-105"
                      : "bg-white text-gray-500 border-gray-100 hover:border-gray-300"
                  }`}
                >
                  Semua Cerita
                </button>
              </SwiperSlide>

              {/* Mapping Kategori dari API */}
              {categories.map((cat) => (
                <SwiperSlide key={cat.id}>
                  <button
                    onClick={() => {
                      setActiveCategoryId(cat.id);
                      setCurrentPage(1);
                    }}
                    className={`w-full block transition-all duration-300 rounded-2xl relative cursor-pointer ${
                      activeCategoryId === cat.id
                        ? "ring-4 ring-[#84E280] ring-offset-2 scale-105 shadow-xl"
                        : "hover:scale-105 shadow-sm"
                    }`}
                  >
                    <img
                      src={getImageUrl(cat.image_icon)}
                      alt={cat.name}
                      className="w-full h-auto object-cover rounded-2xl select-none"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </button>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <button className="admin-cat-next absolute -right-4 md:-right-8 z-20 hover:scale-110 cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed">
            <IconArrowRight />
          </button>
        </div>

        {/* AREA KONTEN: GRID BUKU & PANEL DETAIL */}
        <div className="flex flex-col xl:flex-row gap-8 items-start relative">
          {/* KIRI: GRID CERITA */}
          <div
            className={`transition-all duration-500 flex-1 ${selectedBook ? "xl:w-2/3" : "w-full"}`}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-gray-900">
                {activeCategoryId === "all"
                  ? "Semua Cerita"
                  : categories.find((c) => c.id == activeCategoryId)?.name}
              </h2>
              <div className="flex items-center gap-4 text-sm font-bold text-gray-500">
                <span>
                  {filteredBooks.length > 0
                    ? (currentPage - 1) * itemsPerPage + 1
                    : 0}{" "}
                  dari {filteredBooks.length}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1 hover:text-gray-900 disabled:opacity-30 cursor-pointer"
                  >
                    <HiChevronLeft className="text-xl" />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="p-1 hover:text-gray-900 disabled:opacity-30 cursor-pointer"
                  >
                    <HiChevronRight className="text-xl" />
                  </button>
                </div>
              </div>
            </div>

            {currentBooks.length > 0 ? (
              <div
                className={`grid grid-cols-2 sm:grid-cols-3 gap-6 ${!selectedBook ? "lg:grid-cols-4 xl:grid-cols-5" : "lg:grid-cols-3"}`}
              >
                {currentBooks.map((book) => (
                  <div
                    key={book.id}
                    onClick={() => setSelectedBook(book)}
                    className={`bg-white rounded-3xl p-3 shadow-sm border-2 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-md ${
                      selectedBook?.id === book.id
                        ? "border-[#84E280] bg-[#f0fcf0] ring-2 ring-[#eaf9e9]"
                        : "border-gray-50 hover:border-gray-200"
                    }`}
                  >
                    <div className="w-full aspect-2/3 bg-gray-100 rounded-2xl overflow-hidden mb-4">
                      <img
                        src={getImageUrl(book.image)}
                        alt={book.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/150x220?text=Cover";
                        }}
                      />
                    </div>
                    <div className="px-1 pb-1">
                      <h3 className="font-black text-gray-900 text-[14px] leading-tight mb-1 line-clamp-2">
                        {book.title}
                      </h3>
                      <p className="text-[10px] font-bold text-gray-400 mb-1">
                        Terbit :{" "}
                        {new Date(book.created_at).toLocaleDateString("id-ID")}
                      </p>
                      <p className="text-[11px] font-semibold text-gray-600 truncate">
                        {book.author || "Funtasya Team"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full py-20 flex flex-col items-center justify-center bg-white rounded-3xl border border-gray-100">
                <p className="text-gray-400 font-bold text-lg">
                  Tidak ada cerita di kategori ini.
                </p>
              </div>
            )}
          </div>

          {/* KANAN: PANEL DETAIL BUKU (Sticky) */}
          {selectedBook && (
            <div className="w-full xl:w-95 shrink-0 bg-white rounded-4xl p-6 shadow-xl border border-gray-100 xl:sticky xl:top-8 transition-all animate-fade-in z-10">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-black text-gray-900">
                  Detail Cerita
                </h3>
                <button
                  onClick={() => setSelectedBook(null)}
                  className="p-2 bg-gray-50 text-gray-400 hover:text-gray-800 hover:bg-gray-200 rounded-full cursor-pointer transition-colors"
                >
                  <HiX />
                </button>
              </div>

              <div className="flex gap-5 mb-6">
                <img
                  src={getImageUrl(selectedBook.image)}
                  alt="Cover"
                  className="w-28 h-40 object-cover rounded-xl shadow-md bg-gray-100"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/150x220?text=Cover";
                  }}
                />
                <div className="flex-1 flex flex-col justify-center">
                  <h4 className="font-black text-lg text-gray-900 leading-tight mb-2">
                    {selectedBook.title}
                  </h4>
                  <p className="text-[11px] font-bold text-gray-400 mb-1">
                    Terbit :{" "}
                    {new Date(selectedBook.created_at).toLocaleDateString(
                      "id-ID",
                    )}
                  </p>
                  <p className="text-[11px] font-bold italic text-orange-500 mb-3">
                    {selectedBook.category || "Tanpa Kategori"}
                  </p>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                      <HiHeart className="text-red-500 text-sm" /> 1,2k Suka
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                      <HiChatAlt2 className="text-blue-500 text-sm" /> 40
                      Komentar
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                      <HiStar className="text-yellow-400 text-sm" /> 4.8 Rating
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                      <HiDownload className="text-green-500 text-sm" />{" "}
                      {selectedBook.views_count} Dibaca
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h5 className="font-black text-gray-900 mb-2">
                  {selectedBook.author || "Funtasya Team"}
                </h5>
                <p className="text-sm font-medium text-gray-500 leading-relaxed text-justify line-clamp-6">
                  {selectedBook.description ||
                    "Tidak ada deskripsi untuk cerita ini."}
                </p>
              </div>

              <div className="flex gap-3 mt-auto">
                <button
                  onClick={() => handleArchive(selectedBook.id)}
                  className="flex-1 bg-[#F8AF2F] hover:bg-yellow-500 text-white font-bold py-3.5 rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  Arsipkan
                </button>
                <button
                  onClick={() => handleDelete(selectedBook.id)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold py-3.5 rounded-xl transition-colors cursor-pointer"
                >
                  Hapus
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `,
        }}
      />
    </div>
  );
};

export default AdminPerpustakaan;
