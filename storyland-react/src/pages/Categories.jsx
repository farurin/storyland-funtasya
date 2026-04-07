import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CtaDownload from "../components/CtaDownload";

// Ikon panah ungu lingkaran sesuai desain Figma
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
  // State untuk menyimpan data dari API
  const [categories, setCategories] = useState([]);
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data kategori dan buku dari API
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
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-purple-600 font-bold text-xl">
        Memuat Daftar Kategori...
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header Section */}
      <section className="mx-3 md:mx-20 lg:mx-42 px-6 mt-12 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Kategori
        </h1>
        <p className="text-gray-500 mt-2 text-sm md:text-base">
          Temukan berbagai macam cerita menarik berdasarkan kategori pilihan.
        </p>
      </section>

      {/* Grid Categories */}
      <section className="mx-3 md:mx-20 lg:mx-42 px-6 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {categories.map((cat) => {
            // Menghitung jumlah cerita riil berdasarkan data di tabel books
            const storyCount = books.filter(
              (b) => b.id_categories === cat.id,
            ).length;

            return (
              <Link
                to={`/categories/${cat.id}`}
                key={cat.id}
                className="group block bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                {/* Bagian Atas: Gambar Ilustrasi */}
                <div className="w-full aspect-2/1 bg-gray-50 overflow-hidden relative">
                  <img
                    // Menggunakan image_card dari MySQL
                    src={`/images/category/${cat.image_card}`}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/600x300?text=Ilustrasi+Kategori";
                    }}
                  />
                </div>

                {/* Bagian Bawah: Teks & Ikon */}
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

      {/* CTA Download App */}
      <CtaDownload />
    </div>
  );
};

export default Categories;
