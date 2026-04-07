import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import BannerCorner from "../components/BannerCorner";
import CtaDownload from "../components/CtaDownload";
import Card from "../components/Card";
import CategorySlider from "../components/CategorySlider";

// Ikon untuk tombol Grid & List
const IconGrid = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zm0 11h7v7h-7v-7zM3 14h7v7H3v-7z" />
  </svg>
);

const IconList = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M4 14h2v-2H4v2zm0 5h2v-2H4v2zm0-10h2V7H4v2zm4 5h12v-2H8v2zm0 5h12v-2H8v2zM8 7v2h12V7H8z" />
  </svg>
);

const IconSearch = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#9ca3af"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const CategoryDetail = () => {
  const { id } = useParams();
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  // 1. State untuk menampung data API
  const [categories, setCategories] = useState([]);
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Fetch data dari API Express
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, bookRes] = await Promise.all([
          fetch("http://localhost:5000/api/categories"),
          fetch("http://localhost:5000/api/books"),
        ]);

        if (!catRes.ok || !bookRes.ok) {
          throw new Error("Gagal mengambil data dari server");
        }

        const catData = await catRes.json();
        const bookData = await bookRes.json();

        setCategories(catData);
        setBooks(bookData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Array kosong berarti fetch 1x saja, biarkan React yang memfilter secara dinamis

  // 3. Logika Filter Data
  const category = categories.find((c) => c.id === parseInt(id));

  const filteredBooks = books.filter((b) => {
    const matchCat = b.id_categories === parseInt(id);
    const matchSearch = b.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  // Tampilan Loading
  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-purple-600 font-bold text-xl">
        Menyiapkan Koleksi Buku...
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Banner Category Dinamis */}
      <BannerCorner
        title={category ? category.name : "Kategori"}
        description={
          category
            ? category.description
            : "Jelajahi kisah dari berbagai kategori."
        }
      />

      {/* Slider Category */}
      <div className="mt-10">
        <CategorySlider categories={categories} activeCategoryId={id} />
      </div>

      <section className="mx-3 md:mx-20 lg:mx-42 px-6 mt-12 mb-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          {/* Kolom Pencarian */}
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Cari judul buku..."
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-5 pr-10 py-2.5 rounded-full border border-gray-200 focus:outline-none focus:ring-1 focus:ring-purple-400 text-sm shadow-sm"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <IconSearch />
            </div>
          </div>

          {/* Toggle Grid / List View */}
          <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition ${
                viewMode === "grid"
                  ? "bg-white text-purple-600 shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <IconGrid />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition ${
                viewMode === "list"
                  ? "bg-white text-purple-600 shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <IconList />
            </button>
          </div>
        </div>

        {/* Judul Kategori */}
        {category && (
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            {category.name}
          </h2>
        )}

        {/* Daftar Buku */}
        {filteredBooks.length > 0 ? (
          viewMode === "grid" ? (
            /* GRID VIEW */
            <div className="flex flex-wrap gap-5">
              {filteredBooks.map((book) => (
                <div
                  key={book.id}
                  className="w-44.75 shrink-0 transition-transform duration-300 hover:scale-105 cursor-pointer"
                >
                  <Card book={book} />
                </div>
              ))}
            </div>
          ) : (
            /* LIST VIEW */
            <div className="flex flex-col gap-5">
              {filteredBooks.map((book) => (
                <div
                  key={book.id}
                  className="flex bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden p-4 md:p-5 gap-5 md:gap-8 hover:shadow-md transition cursor-pointer"
                >
                  {/* Cover Buku Kiri */}
                  <div className="w-24 md:w-32 shrink-0">
                    <div className="w-full aspect-2/3 rounded-lg overflow-hidden bg-gray-100 shadow-sm">
                      <img
                        src={`/images/books/${book.image}`}
                        alt={book.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/150x220?text=Cover";
                        }}
                      />
                    </div>
                  </div>

                  {/* Info Buku Kanan */}
                  <div className="flex flex-col justify-center flex-1 py-1">
                    <h3 className="text-lg md:text-xl font-bold text-gray-900">
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-3 md:line-clamp-4 max-w-4xl leading-relaxed">
                      {book.description ||
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-20 text-gray-400 font-medium bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            Tidak ada buku yang sesuai dengan pencarian di kategori ini.
          </div>
        )}
      </section>

      {/* CTA Download App */}
      <CtaDownload />
    </div>
  );
};

export default CategoryDetail;
