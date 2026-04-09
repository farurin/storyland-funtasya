import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import StoryReader from "../components/StoryReader";
import StoryActions from "../components/StoryActions";
import BookInfoBanner from "../components/BookInfoBanner";
import { CategorySection } from "../components/BookListSection";
import CtaDownload from "../components/CtaDownload";

const BookDetail = () => {
  const { id } = useParams();

  const [book, setBook] = useState(null);
  const [categoryData, setCategoryData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isFavorite, setIsFavorite] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const [booksRes, catsRes] = await Promise.all([
          fetch("http://localhost:5000/api/books"),
          fetch("http://localhost:5000/api/categories"),
        ]);

        const books = await booksRes.json();
        const categories = await catsRes.json();

        const currentBook = books.find((b) => b.id === parseInt(id));

        if (currentBook) {
          setBook(currentBook);

          const cat = categories.find(
            (c) => c.id === currentBook.id_categories,
          );
          if (cat) {
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
    window.scrollTo(0, 0);
  }, [id]);

  const handleFullscreen = () => {
    const elem = document.documentElement;
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
        {/* Judul Buku di atas StoryReader */}
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
            {book.title}
          </h1>
        </div>

        {/* Pembaca Cerita */}
        <StoryReader book={book} />

        {/* Tombol Aksi */}
        <StoryActions
          isFavorite={isFavorite}
          isSaved={isSaved}
          onToggleFavorite={() => setIsFavorite(!isFavorite)}
          onToggleSave={() => setIsSaved(!isSaved)}
          onToggleFullscreen={handleFullscreen}
        />

        {/* Banner Info Buku */}
        <BookInfoBanner book={book} />

        {/* Rekomendasi Kategori Terkait */}
        {categoryData && (
          <CategorySection
            category={categoryData}
            customTitle={`${categoryData.name} lainnya`}
          />
        )}
      </div>

      <CtaDownload />
    </div>
  );
};

export default BookDetail;
