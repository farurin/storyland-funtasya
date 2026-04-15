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

  const [activeCategory, setActiveCategory] = useState("Semua");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catData, bookData] = await Promise.all([
          getCategories(),
          getBooks(),
        ]);

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
