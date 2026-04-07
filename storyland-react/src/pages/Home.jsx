import React, { useState, useEffect } from "react";
import Hero from "../components/Hero";
import Carousel from "../components/Carousel";
import Category from "../components/Category";
import ListBooks from "../components/ListBooks";
import HeroBanner from "../components/HeroBanner";

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
      <Hero />
      <Carousel
        books={books}
        onChangeCategory={setActiveCategory}
        onSearch={setSearch}
      />
      <Category categories={categories} />
      <ListBooks data={categoriesWithBooks} />
      <HeroBanner />
    </div>
  );
};

export default Home;
