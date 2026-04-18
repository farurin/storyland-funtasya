import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CtaDownload from "../components/CtaDownload";
import { getCategories, getBooks } from "../services/api";
import { getImageUrl } from "../utils/getImageUrl";

const IconArrowCircle = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill="none"
  >
    <circle cx="12" cy="12" r="12" fill="#6B4EFF" />
    <path
      d="M10.5 8L14.5 12L10.5 16"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [books, setBooks] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null); // Reset error
      try {
        const [catData, bookData] = await Promise.all([
          getCategories(),
          getBooks(),
        ]);

        setCategories(catData);
        setBooks(bookData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "Gagal terhubung ke server.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // tampilan error
  if (error) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-red-500 mb-2">
          Gagal Memuat Kategori
        </h2>
        <p className="text-gray-500 mb-6 max-w-md">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-8 py-3 bg-[#6B4EFF] text-white rounded-full font-bold shadow-md hover:bg-purple-700 transition cursor-pointer"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  // tampilan loading
  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-purple-600 font-bold text-xl">
        Memuat Daftar Kategori...
      </div>
    );
  }

  // tampilan sukses
  return (
    <div className="w-full">
      <section className="mx-3 md:mx-20 lg:mx-42 px-6 mt-12 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Kategori
        </h1>
        <p className="text-gray-500 mt-2 text-sm md:text-base">
          Temukan berbagai macam cerita menarik berdasarkan kategori pilihan.
        </p>
      </section>

      <section className="mx-3 md:mx-20 lg:mx-42 px-6 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {categories.map((cat) => {
            const storyCount = books.filter(
              (b) => b.id_categories === cat.id,
            ).length;

            return (
              <Link
                to={`/categories/${cat.id}`}
                key={cat.id}
                className="group block bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-full aspect-2/1 bg-gray-50 overflow-hidden relative">
                  <img
                    // helper bungkus cat.image_card
                    src={getImageUrl(cat.image_card)}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/600x300?text=Ilustrasi+Kategori";
                    }}
                  />
                </div>
                <div className="p-5 flex items-center justify-between">
                  <h2 className="text-lg md:text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                    {cat.name}
                  </h2>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-600">
                      {storyCount} cerita
                    </span>
                    <IconArrowCircle />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <CtaDownload />
    </div>
  );
};

export default Categories;
