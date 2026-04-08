import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import StoryReader from "../components/StoryReader";
import StoryActions from "../components/StoryActions";
import BookInfoBanner from "../components/BookInfoBanner";
import { CategorySection } from "../components/BookListSection"; // Import dari komponen yang sudah ada!
import CtaDownload from "../components/CtaDownload";

const BookDetail = () => {
  const { id } = useParams();

  const [book, setBook] = useState(null);
  const [categoryData, setCategoryData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // State tiruan untuk tombol (Nanti disambung ke API betulan)
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        // Fetch semua buku dan kategori (Untuk sekarang kita filter di frontend)
        const [booksRes, catsRes] = await Promise.all([
          fetch("http://localhost:5000/api/books"),
          fetch("http://localhost:5000/api/categories"),
        ]);

        const books = await booksRes.json();
        const categories = await catsRes.json();

        // Cari buku yang sedang dibuka
        const currentBook = books.find((b) => b.id === parseInt(id));

        if (currentBook) {
          setBook(currentBook);

          // Cari data kategori dari buku ini
          const cat = categories.find(
            (c) => c.id === currentBook.id_categories,
          );
          if (cat) {
            // Masukkan daftar buku yang memiliki kategori sama untuk Swiper di bawah
            cat.books = books.filter((b) => b.id_categories === cat.id);
            setCategoryData(cat);
          }
        }
      } catch (error) {
        console.error("Error fetching book details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookData();
    // Scroll ke atas setiap kali buka buku baru
    window.scrollTo(0, 0);
  }, [id]);

  // Fungsi untuk fitur Layar Penuh (Fullscreen API HTML5)
  const handleFullscreen = () => {
    const elem = document.documentElement; // Buat seluruh halaman jadi fullscreen
    if (!document.fullscreenElement) {
      elem.requestFullscreen().catch((err) => {
        console.error(`Gagal masuk mode layar penuh: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center font-bold text-purple-600">
        Menyiapkan Cerita...
      </div>
    );
  }

  if (!book) {
    return (
      <div className="w-full h-screen flex items-center justify-center font-bold text-red-500">
        Buku tidak ditemukan!
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mx-3 md:mx-20 lg:mx-42 px-6 mt-10">
        {/* 1. Pembaca Cerita */}
        <StoryReader book={book} />

        {/* 2. Tombol Aksi Interaktif */}
        <StoryActions
          isFavorite={isFavorite}
          isSaved={isSaved}
          onToggleFavorite={() => setIsFavorite(!isFavorite)}
          onToggleSave={() => setIsSaved(!isSaved)}
          onToggleFullscreen={handleFullscreen}
        />

        {/* 3. Banner Info Buku */}
        <BookInfoBanner book={book} />

        {/* 4. Rekomendasi Kategori Terkait */}
        {categoryData && (
          <CategorySection
            category={categoryData}
            customTitle={`${categoryData.name} lainnya`}
          />
        )}
      </div>

      {/* 5. CTA App */}
      <CtaDownload />
    </div>
  );
};

export default BookDetail;
