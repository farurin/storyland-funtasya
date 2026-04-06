import React, { useEffect, useState } from "react";
import Hero from "../components/Hero";
import { getBookByCategories, getAllCategories } from "../services/api";
import Carousel from "../components/Carousel";
import Category from "../components/Category";
import ListBooks from "../components/ListBooks";
import HeroBanner from "../components/HeroBanner";

const Home = () => {
  // books
  const [books, setBooks] = useState([]);
  const [category, setCategory] = useState(1);
  const [search, setSearch] = useState("");

  // categories
  const [categories, setCategories] = useState([]);

  // get all data books
  useEffect(() => {
    // debounce wait 300ms
    const delay = setTimeout(() => {
      const data = getBookByCategories(category);

      const filtered = data.filter((book) =>
        book.title.toLowerCase().includes(search.toLowerCase()),
      );

      setBooks(filtered);
    }, 300);

    return () => clearTimeout(delay);
  }, [category, search]);

  // get all categories
  useEffect(() => {
    const data = getAllCategories();

    setCategories(data);
  }, []);
  return (
    <div>
      <Hero></Hero>
      <Carousel
        books={books}
        onChangeCategory={setCategory}
        onSearch={setSearch}
      ></Carousel>

      <Category categories={categories} />

      <ListBooks />

      <HeroBanner />
    </div>
  );
};

export default Home;
