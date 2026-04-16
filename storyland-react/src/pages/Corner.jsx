import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import BannerCorner from "../components/BannerCorner";
import FilterCorner from "../components/FilterCorner";
import Progress from "../components/Progress";
import CtaDownload from "../components/CtaDownload";
import { getCornerData } from "../services/api";

const Corner = () => {
  const { isLoggedIn, token, refreshKey } = useAuth();

  const [activeFilter, setActiveFilter] = useState(() => {
    return localStorage.getItem("cornerActiveTab") || "riwayat";
  });
  useEffect(() => {
    localStorage.setItem("cornerActiveTab", activeFilter);
  }, [activeFilter]);
  const [search, setSearch] = useState("");

  const [progressData, setProgressData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const groupHistoryByDate = (historyArray) => {
    const grouped = { "Hari Ini": [], Kemarin: [], "Lebih Lama": [] };
    const today = new Date().setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(new Date(today).getDate() - 1);

    historyArray.forEach((item) => {
      const readDate = new Date(item.last_read_at).setHours(0, 0, 0, 0);
      if (readDate === today) {
        grouped["Hari Ini"].push(item);
      } else if (readDate === yesterday) {
        grouped["Kemarin"].push(item);
      } else {
        grouped["Lebih Lama"].push(item);
      }
    });
    return grouped;
  };

  const fetchCornerData = useCallback(async () => {
    if (!isLoggedIn) {
      setProgressData({});
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      let endpoint = "";
      if (activeFilter === "favorit") endpoint = "favorites";
      else if (activeFilter === "disimpan") endpoint = "saved";
      else endpoint = "history";

      const data = await getCornerData(endpoint, token);

      if (activeFilter === "favorit") setProgressData({ Favorit: data });
      else if (activeFilter === "disimpan") setProgressData({ Disimpan: data });
      else setProgressData(groupHistoryByDate(data));
    } catch (err) {
      console.error("Error fetching corner data:", err.message);
      setProgressData({});
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [activeFilter, isLoggedIn, token]);

  useEffect(() => {
    fetchCornerData();
  }, [fetchCornerData, refreshKey]);

  // logika pencarian
  const filteredProgressData = useMemo(() => {
    // Jika tidak ada pencarian, kembalikan data utuh
    if (!search) return progressData;

    const filtered = {};
    // Looping setiap grup (Favorit, Hari Ini, dll) dan saring bukunya
    for (const [groupName, books] of Object.entries(progressData)) {
      const matchedBooks = books.filter((book) =>
        book.title.toLowerCase().includes(search.toLowerCase()),
      );
      // Hanya masukkan grup yang memiliki buku hasil pencarian
      if (matchedBooks.length > 0) {
        filtered[groupName] = matchedBooks;
      }
    }
    return filtered;
  }, [progressData, search]);

  const emptyContent = {
    riwayat: isLoggedIn
      ? {
          title: "Riwayat Bacamu Masih Kosong",
          desc: "Daftar buku yang kamu baca akan muncul di sini.",
        }
      : {
          title: "Riwayat Bacamu Masih Rahasia!",
          desc: "Yuk, buat akunmu sekarang untuk menyimpan riwayat bacaanmu.",
        },
    favorit: isLoggedIn
      ? {
          title: "Belum Ada Cerita yang Kamu Sukai",
          desc: "Kamu dapat menekan tombol di sampul cerita untuk mengubah cerita favoritmu",
        }
      : {
          title: "Wah, Rak Favoritmu Masih Kosong!",
          desc: "Yuk, buat akunmu sekarang.",
        },
    disimpan: isLoggedIn
      ? {
          title: "Belum Ada Cerita yang Kamu Simpan",
          desc: "Klik tanda bookmark pada cerita yang ingin kamu simpan.",
        }
      : {
          title: "Rak Bukumu Masih Menunggu!",
          desc: "Yuk, buat akunmu sekarang.",
        },
  };

  // Kondisi untuk menentukan UI apa yang harus muncul
  const hasNoBooksOriginal =
    !isLoading &&
    Object.values(progressData).every((group) => group.length === 0);
  const hasNoSearchResults =
    !isLoading &&
    search &&
    Object.values(filteredProgressData).every((group) => group.length === 0);

  return (
    <div className="w-full">
      <BannerCorner />
      <FilterCorner
        activeFilter={activeFilter}
        onChangeFilter={setActiveFilter}
        onSearch={setSearch}
      />

      <div className="w-full min-h-100">
        {/* UI JIKA ERROR API */}
        {error && !isLoading && (
          <div className="mx-3 md:mx-20 lg:mx-42 px-6 py-20 text-center bg-white mt-12 mb-20 rounded-3xl border border-red-100 shadow-sm">
            <h3 className="text-xl md:text-2xl font-bold text-red-500 leading-tight">
              Oops! Terjadi Kesalahan
            </h3>
            <p className="text-gray-500 mt-3 text-sm md:text-base max-w-lg mx-auto">
              {error}
            </p>
            <button
              onClick={fetchCornerData}
              className="mt-6 px-6 py-2 bg-[#FDECA2] text-black font-bold rounded-full hover:bg-yellow-300 transition shadow-sm"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* UI JIKA SEDANG LOADING */}
        {isLoading && (
          <div className="mx-3 md:mx-20 lg:mx-42 px-6 py-20 text-center text-gray-400 font-medium animate-pulse bg-white mt-12 mb-20">
            Memuat data {activeFilter}...
          </div>
        )}

        {/* UI JIKA RAK BUKU MEMANG KOSONG DARI AWAL */}
        {!isLoading && !error && hasNoBooksOriginal && !search && (
          <div className="mx-3 md:mx-20 lg:mx-42 px-6 py-32 text-center bg-white mt-12 mb-20">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
              {emptyContent[activeFilter].title}
            </h3>
            <p className="text-gray-500 mt-3 text-sm md:text-base max-w-lg mx-auto">
              {emptyContent[activeFilter].desc}
            </p>
          </div>
        )}

        {/* UI JIKA HASIL PENCARIAN TIDAK DITEMUKAN */}
        {!isLoading && !error && hasNoSearchResults && (
          <div className="mx-3 md:mx-20 lg:mx-42 px-6 py-24 text-center bg-white mt-12 mb-20 rounded-3xl border border-dashed border-gray-200">
            <h3 className="text-xl md:text-2xl font-bold text-gray-400 leading-tight">
              Pencarian tidak ditemukan
            </h3>
            <p className="text-gray-400 mt-2 text-sm md:text-base">
              Tidak ada buku yang sesuai dengan kata kunci "{search}" di rak
              ini.
            </p>
          </div>
        )}

        {/* UI JIKA BUKU ADA DAN/ATAU PENCARIAN DITEMUKAN */}
        {!isLoading && !error && !hasNoBooksOriginal && !hasNoSearchResults && (
          <>
            {activeFilter === "favorit" && !search && (
              <div className="mx-3 md:mx-20 lg:mx-42 px-6 mt-12 -mb-5">
                <h2 className="text-2xl font-bold text-gray-900">
                  Semua cerita favorit-mu
                </h2>
                <p className="text-gray-500 mt-1 text-sm md:text-base">
                  Kamu dapat menekan tombol di sampul cerita untuk mengubah
                  cerita favoritmu
                </p>
              </div>
            )}
            {activeFilter === "disimpan" && !search && (
              <div className="mx-3 md:mx-20 lg:mx-42 px-6 mt-12 -mb-5">
                <h2 className="text-2xl font-bold text-gray-900">
                  Disimpan untuk nanti
                </h2>
                <p className="text-gray-500 mt-1 text-sm md:text-base">
                  {progressData["Disimpan"]?.length || 0} cerita menunggumu
                  untuk dibaca.
                </p>
              </div>
            )}
            {search && (
              <div className="mx-3 md:mx-20 lg:mx-42 px-6 mt-12 -mb-5">
                <h2 className="text-2xl font-bold text-gray-900">
                  Hasil Pencarian
                </h2>
              </div>
            )}

            {/* oper data yang sudah di-filter (filteredProgressData) ke komponen Progress */}
            <Progress
              data={filteredProgressData}
              search={search}
              type={activeFilter}
            />
          </>
        )}
      </div>
      <CtaDownload />
    </div>
  );
};

export default Corner;
