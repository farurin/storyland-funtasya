import React, { useState, useEffect } from "react";
import HeroSection from "../components/HeroSection";
import Carousel from "../components/Carousel";
import CategorySlider from "../components/CategorySlider";
import BookListSection from "../components/BookListSection";
import CtaDownload from "../components/CtaDownload";

const Home = () => {
  const [categories, setCategories] = useState([]);
  // 1. Sekarang state books dimulai dari array kosong, bukan lagi dari data.json
  const [books, setBooks] = useState([]);

  const [activeCategory, setActiveCategory] = useState("Semua");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // 2. Mengambil Kategori dan Buku secara bersamaan dari API Express
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Promise.all agar fetch berjalan paralel (lebih cepat)
        const [catRes, bookRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/categories`),
          fetch(`${import.meta.env.VITE_API_URL}/books`),
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

  const categoriesWithBooks = categories.map((cat) => ({
    ...cat,
    books: books.filter((b) => b.id_categories === cat.id),
  }));

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
      <Carousel
        books={books}
        onChangeCategory={setActiveCategory}
        onSearch={setSearch}
      />
      <CategorySlider categories={categories} />
      <BookListSection data={categoriesWithBooks} />
      <CtaDownload />
    </div>
  );
};

export default Home;
