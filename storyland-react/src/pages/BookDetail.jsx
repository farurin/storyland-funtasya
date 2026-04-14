import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import StoryReader from "../components/StoryReader";
import StoryActions from "../components/StoryActions";
import BookInfoBanner from "../components/BookInfoBanner";
import { CategorySection } from "../components/BookListSection";
import CtaDownload from "../components/CtaDownload";
import { useAuth } from "../context/AuthContext";

const BookDetail = () => {
  const { id } = useParams();
  const { token, isLoggedIn } = useAuth();

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

          // fetch status simpan & faforit jika login
          if (isLoggedIn && token) {
            const statusRes = await fetch(
              `http://localhost:5000/api/books/${currentBook.id}/status`,
              {
                headers: { Authorization: `Bearer ${token}` },
              },
            );
            if (statusRes.ok) {
              const statusData = await statusRes.json();
              setIsFavorite(statusData.isFavorite);
              setIsSaved(statusData.isSaved);
            }
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
  }, [id, isLoggedIn, token]);

  // fungsi toggle
  const handleToggleFavorite = async () => {
    if (!isLoggedIn)
      return alert("Silakan login terlebih dahulu untuk menyukai cerita.");
    try {
      const res = await fetch(
        `http://localhost:5000/api/books/${book.id}/favorite`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.ok) {
        const data = await res.json();
        setIsFavorite(data.isFavorite);
      }
    } catch (error) {
      console.error("Gagal toggle favorit:", error);
    }
  };

  const handleToggleSave = async () => {
    if (!isLoggedIn)
      return alert("Silakan login terlebih dahulu untuk menyimpan cerita.");
    try {
      const res = await fetch(
        `http://localhost:5000/api/books/${book.id}/save`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.ok) {
        const data = await res.json();
        setIsSaved(data.isSaved);
      }
    } catch (error) {
      console.error("Gagal toggle simpan:", error);
    }
  };

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

  if (isLoading)
    return (
      <div className="w-full h-screen flex items-center justify-center font-bold text-purple-600">
        Menyiapkan Cerita...
      </div>
    );
  if (!book)
    return (
      <div className="w-full h-screen flex items-center justify-center font-bold text-red-500">
        Buku tidak ditemukan!
      </div>
    );

  return (
    <div className="w-full">
      <div className="mx-3 md:mx-20 lg:mx-42 px-6 mt-10">
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
            {book.title}
          </h1>
        </div>
        <StoryReader book={book} />
        <StoryActions
          isFavorite={isFavorite}
          isSaved={isSaved}
          onToggleFavorite={handleToggleFavorite}
          onToggleSave={handleToggleSave}
          onToggleFullscreen={handleFullscreen}
        />
        <BookInfoBanner book={book} />
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
