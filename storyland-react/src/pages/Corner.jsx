import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import BannerCorner from "../components/BannerCorner";
import FilterCorner from "../components/FilterCorner";
import Progress from "../components/Progress";
import CtaDownload from "../components/CtaDownload";

const Corner = () => {
  const { isLoggedIn, token } = useAuth(); // token sudah diambil

  const [activeFilter, setActiveFilter] = useState("riwayat");
  const [search, setSearch] = useState("");

  const [progressData, setProgressData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    const fetchCornerData = async () => {
      if (!isLoggedIn && activeFilter !== "riwayat") {
        setProgressData({});
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        let endpoint = "";
        if (activeFilter === "favorit") endpoint = "favorites";
        else if (activeFilter === "disimpan") endpoint = "saved";
        else endpoint = "history";

        const response = await fetch(
          `http://localhost:5000/api/corner/${endpoint}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (!response.ok) throw new Error("Gagal mengambil data");

        const data = await response.json();

        if (activeFilter === "favorit") {
          setProgressData({ Favorit: data });
        } else if (activeFilter === "disimpan") {
          setProgressData({ Disimpan: data });
        } else {
          setProgressData(groupHistoryByDate(data));
        }
      } catch (error) {
        console.error("Error fetching corner data:", error);
        setProgressData({});
      } finally {
        setIsLoading(false);
      }
    };

    fetchCornerData();
  }, [activeFilter, isLoggedIn, token]); // <- Warning teratasi, token sudah dimasukkan

  const emptyContent = {
    riwayat: {
      title: "Riwayat Bacamu Masih Kosong",
      desc: "Daftar buku yang kamu baca akan muncul di sini. Yuk, pilih satu cerita menarik dan mulai baca sekarang!",
    },
    favorit: isLoggedIn
      ? {
          title: "Belum Ada Cerita yang Kamu Sukai",
          desc: "Kamu dapat menekan tombol di sampul cerita untuk mengubah cerita favoritmu",
        }
      : {
          title: "Wah, Rak Favoritmu Masih Kosong!",
          desc: "Yuk, buat akunmu sekarang supaya semua cerita yang kamu beri tanda hati tetap tersimpan aman untuk dibaca lagi nanti.",
        },
    disimpan: isLoggedIn
      ? {
          title: "Belum Ada Cerita yang Kamu Simpan",
          desc: "Klik tanda bookmark pada cerita yang ingin kamu simpan agar bisa dilanjutkan kapan saja!",
        }
      : {
          title: "Rak Bukumu Masih Menunggu!",
          desc: "Yuk, buat akunmu sekarang supaya semua cerita yang kamu simpan punya tempat yang rapi di rak pribadimu dan tidak hilang saat kamu kembali lagi nanti.",
        },
  };

  const hasNoBooks =
    !isLoading &&
    Object.values(progressData).every((group) => group.length === 0);

  return (
    <div className="w-full">
      <BannerCorner />
      <FilterCorner
        activeFilter={activeFilter}
        onChangeFilter={setActiveFilter}
        onSearch={setSearch}
      />

      {/* wrapper for seamless loading */}
      <div className="w-full min-h-100">
        {/* 1. Kondisi Loading */}
        {isLoading && (
          <div className="mx-3 md:mx-20 lg:mx-42 px-6 py-20 text-center text-gray-400 font-medium animate-pulse bg-white mt-12 mb-20">
            Memuat data {activeFilter}...
          </div>
        )}

        {/* 2. Kondisi Kosong (Empty State) */}
        {!isLoading && hasNoBooks && (
          <div className="mx-3 md:mx-20 lg:mx-42 px-6 py-32 text-center bg-white mt-12 mb-20">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
              {emptyContent[activeFilter].title}
            </h3>
            <p className="text-gray-500 mt-3 text-sm md:text-base max-w-lg mx-auto">
              {emptyContent[activeFilter].desc}
            </p>
          </div>
        )}

        {/* 3. Kondisi Ada Data */}
        {!isLoading && !hasNoBooks && (
          <>
            {activeFilter === "favorit" && (
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

            {activeFilter === "disimpan" && (
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

            <Progress data={progressData} search={search} type={activeFilter} />
          </>
        )}
      </div>

      <CtaDownload />
    </div>
  );
};

export default Corner;
