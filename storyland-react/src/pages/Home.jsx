import React, { useState, useEffect } from "react";
import Hero from "../components/Hero";
import Carousel from "../components/Carousel";
import Category from "../components/Category";
import ListBooks from "../components/ListBooks";
import HeroBanner from "../components/HeroBanner";
// Sementara import data.json untuk mengambil daftar BUKU saja
import jsonData from "../../data.json";

const Home = () => {
  // state untuk menyimpan data dari API
  const [categories, setCategories] = useState([]);
  const [books, setBooks] = useState(jsonData.books); // Buku masih statis

  const [activeCategory, setActiveCategory] = useState("Semua");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // useEffect untuk ambil data saat halaman pertama kali dimuat
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // panggil API Express yang berjalan di port 5000
        const response = await fetch("http://localhost:5000/api/categories");

        if (!response.ok) {
          throw new Error("Gagal mengambil data dari server");
        }

        const data = await response.json();
        setCategories(data); // Simpan data ke dalam state
        setIsLoading(false); // Matikan loading
      } catch (error) {
        console.error("Error fetching categories:", error);
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []); // Array kosong [] memastikan fetch hanya berjalan 1x saat render awal

  // Logika untuk menggabungkan Buku ke dalam Kategori (Dibutuhkan oleh ListBooks)
  const categoriesWithBooks = categories.map((cat) => ({
    ...cat,
    books: books.filter((b) => b.id_categories === cat.id),
  }));

  // Jika data masih dimuat, tampilkan layar loading sederhana
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
