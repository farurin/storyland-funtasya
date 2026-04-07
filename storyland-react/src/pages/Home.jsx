import React, { useEffect, useState } from "react";
import Hero from "../components/Hero";
import {
  getBookByCategories,
  getAllCategories,
  getCategoriesWithBooks,
} from "../services/api";
import Carousel from "../components/Carousel";
import Category from "../components/Category";
import ListBooks from "../components/ListBooks";
import HeroBanner from "../components/HeroBanner";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [category, setCategory] = useState(1);
  const [search, setSearch] = useState("");

  // Lazy initialization: langsung isi state dari fungsi
  const [categories] = useState(() => getAllCategories());
  const [categoriesWithBooks] = useState(() => getCategoriesWithBooks());

  // useEffect hanya untuk debounce search
  useEffect(() => {
    const delay = setTimeout(() => {
      const data = getBookByCategories(category);

      const filtered = data.filter((book) =>
        book.title.toLowerCase().includes(search.toLowerCase()),
      );

      setBooks(filtered);
    }, 300);

    return () => clearTimeout(delay);
  }, [category, search]);

  return (
    <div>
      <Hero />
      <Carousel
        books={books}
        onChangeCategory={setCategory}
        onSearch={setSearch}
      />
      <Category categories={categories} />
      <ListBooks data={categoriesWithBooks} />
      <HeroBanner />
    </div>
  );
};

export default Home;
