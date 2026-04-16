import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import StoryReader from "../components/StoryReader";
import StoryActions from "../components/StoryActions";
import BookInfoBanner from "../components/BookInfoBanner";
import { CategorySection } from "../components/BookListSection";
import CtaDownload from "../components/CtaDownload";
import { useAuth } from "../context/AuthContext";
import ActionPopupModal from "../components/ActionPopupModal";
import {
  getBooks,
  getCategories,
  getBookStatus,
  toggleFavorite,
  toggleSave,
} from "../services/api";

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, isLoggedIn, triggerRefresh } = useAuth();

  const [book, setBook] = useState(null);
  const [categoryData, setCategoryData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isFavorite, setIsFavorite] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [popupConfig, setPopupConfig] = useState(null);

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        // Panggil API
        const [books, categories] = await Promise.all([
          getBooks(),
          getCategories(),
        ]);

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

          // Fetch status simpan & favorit jika login
          if (isLoggedIn && token) {
            const statusData = await getBookStatus(currentBook.id, token);
            setIsFavorite(statusData.isFavorite);
            setIsSaved(statusData.isSaved);
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

  // Logika eksekusi API & trigger notifikasi corner
  const executeToggleFavAPI = async () => {
    try {
      const data = await toggleFavorite(book.id, token);
      setIsFavorite(data.isFavorite);
      triggerRefresh();
    } catch (error) {
      console.error("Gagal toggle favorit:", error);
    }
  };

  const executeToggleSaveAPI = async () => {
    try {
      const data = await toggleSave(book.id, token);
      setIsSaved(data.isSaved);
      triggerRefresh();
    } catch (error) {
      console.error("Gagal toggle simpan:", error);
    }
  };

  // Handler show popup
  const handleToggleFavorite = async () => {
    if (!isLoggedIn) {
      setPopupConfig({
        image: "/images/popups/popup-fav-guest.png",
        title: "Wah, Rak Favoritmu Masih Kosong!",
        description:
          "Yuk, buat akunmu sekarang supaya semua cerita yang kamu beri tanda hati tetap tersimpan aman untuk dibaca lagi nanti.",
        primaryBtnText: "Buat Akun",
        primaryBtnColor: "bg-[#8B5CF6] hover:bg-purple-700",
        secondaryBtnText: "Nanti Saja",
        onPrimaryClick: () => navigate("/register"),
        onSecondaryClick: () => setPopupConfig(null),
      });
      return;
    }

    if (isFavorite) {
      setPopupConfig({
        image: "/images/popups/popup-delete-fav.png",
        title: "Hapus dari Favorit",
        description:
          "Setelah dihapus, cerita ini tidak akan ada di daftar favoritmu",
        primaryBtnText: "Hapus",
        primaryBtnColor: "bg-[#8B5CF6] hover:bg-purple-700",
        secondaryBtnText: "Batalkan",
        onPrimaryClick: () => {
          executeToggleFavAPI();
          setPopupConfig(null);
        },
        onSecondaryClick: () => setPopupConfig(null),
      });
    } else {
      await executeToggleFavAPI();
      setPopupConfig({
        image: "/images/popups/popup-fav.png",
        title: "Difavoritkan",
        description: "Lihat dan baca cerita yang sudah kamu favoritkan yuk!",
        primaryBtnText: "Lihat",
        primaryBtnColor: "bg-[#8B5CF6] hover:bg-purple-700",
        secondaryBtnText: "Tutup",
        onPrimaryClick: () => navigate("/corner"),
        onSecondaryClick: () => setPopupConfig(null),
      });
    }
  };

  const handleToggleSave = async () => {
    if (!isLoggedIn) {
      setPopupConfig({
        image: "/images/popups/popup-saved-guest.png",
        title: "Rak Bukumu Masih Menunggu!",
        description:
          "Yuk, buat akunmu sekarang supaya semua cerita yang kamu simpan punya tempat yang rapi di rak pribadimu.",
        primaryBtnText: "Buat Akun",
        primaryBtnColor: "bg-[#8B5CF6] hover:bg-purple-700",
        secondaryBtnText: "Nanti Saja",
        onPrimaryClick: () => navigate("/register"),
        onSecondaryClick: () => setPopupConfig(null),
      });
      return;
    }

    if (isSaved) {
      await executeToggleSaveAPI();
    } else {
      await executeToggleSaveAPI();
      setPopupConfig({
        image: "/images/popups/popup-bookmark.png",
        title: "Berhasil Menyimpan",
        description:
          "Kamu bisa melihat cerita yang sudah kamu simpan di halaman Corner",
        primaryBtnText: "Lihat",
        primaryBtnColor: "bg-[#8B5CF6] hover:bg-purple-700",
        secondaryBtnText: "Tutup",
        onPrimaryClick: () => navigate("/corner"),
        onSecondaryClick: () => setPopupConfig(null),
      });
    }
  };

  const handleFullscreen = () => {
    const elem = document.getElementById("story-reader-container");
    if (!elem) return;

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

      {/* Render Popup */}
      <ActionPopupModal isOpen={popupConfig !== null} {...popupConfig} />
    </div>
  );
};

export default BookDetail;
