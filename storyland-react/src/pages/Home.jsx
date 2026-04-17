import React, { useState, useEffect } from "react";
import HeroSection from "../components/HeroSection";
import Carousel from "../components/Carousel";
import CategorySlider from "../components/CategorySlider";
import BookListSection from "../components/BookListSection";
import CtaDownload from "../components/CtaDownload";
import { getCategories, getBooks } from "../services/api";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [books, setBooks] = useState([]);

  const [, setActiveCategory] = useState("Semua");
  const [, setSearch] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
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

  const categoriesWithBooks = categories.map((cat) => ({
    ...cat,
    books: books.filter((b) => b.id_categories === cat.id),
  }));

  if (error) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-red-500 mb-2">
          Oops! Gagal Memuat Dunia Funtasya
        </h2>
        <p className="text-gray-500 mb-6 max-w-md">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-8 py-3 bg-[#6B4EFF] text-white rounded-full font-bold shadow-md hover:bg-purple-700 transition cursor-pointer"
        >
          Muat Ulang Halaman
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-purple-600 font-bold text-xl">
        Memuat Dunia Funtasya...
      </div>
    );
  }

  return (
    <div>
      <HeroSection />

      {/* TARGET SCROLL: bungkus Carousel dengan div ber-ID */}
      <div id="jelajahi-cerita" className="scroll-mt-24 md:scroll-mt-28">
        <Carousel
          books={books}
          onChangeCategory={setActiveCategory}
          onSearch={setSearch}
        />
      </div>

      <CategorySlider categories={categories} />
      <BookListSection data={categoriesWithBooks} />
      <CtaDownload />
    </div>
  );
};

export default Home;
