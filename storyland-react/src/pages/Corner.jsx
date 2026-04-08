import React, { useState, useEffect } from "react";
import BannerCorner from "../components/BannerCorner";
import FilterCorner from "../components/FilterCorner";
import Progress from "../components/Progress";
import CtaDownload from "../components/CtaDownload";

const Corner = () => {
  const [activeFilter, setActiveFilter] = useState("riwayat");
  const [search, setSearch] = useState("");

  // State untuk API
  const [progressData, setProgressData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Fungsi untuk mengelompokkan tanggal riwayat menjadi Hari Ini, Kemarin, dll
  const groupHistoryByDate = (historyArray) => {
    const grouped = { "Hari Ini": [], Kemarin: [], "Lebih Lama": [] };

    // Normalisasi waktu hari ini dan kemarin ke jam 00:00:00
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

  // Fetch API setiap kali tab (activeFilter) berubah
  useEffect(() => {
    const fetchCornerData = async () => {
      setIsLoading(true);
      try {
        let endpoint = "";
        if (activeFilter === "favorit") endpoint = "favorites";
        else if (activeFilter === "disimpan") endpoint = "saved";
        else endpoint = "history";

        const response = await fetch(
          `http://localhost:5000/api/corner/${endpoint}`,
        );
        if (!response.ok) throw new Error("Gagal mengambil data");

        const data = await response.json();

        if (activeFilter === "favorit") {
          setProgressData({ Favorit: data });
        } else if (activeFilter === "disimpan") {
          setProgressData({ Disimpan: data });
        } else {
          // Khusus riwayat, jalankan fungsi pengelompokan tanggal
          setProgressData(groupHistoryByDate(data));
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCornerData();
  }, [activeFilter]); // Efek berjalan ulang tiap klik tab

  return (
    <div className="w-full">
      <BannerCorner />
      <FilterCorner
        activeFilter={activeFilter}
        onChangeFilter={setActiveFilter}
        onSearch={setSearch}
      />

      {/* Header Khusus Tab Favorit */}
      {activeFilter === "favorit" && (
        <div className="mx-3 md:mx-20 lg:mx-42 px-6 mt-12">
          <h2 className="text-2xl font-bold text-gray-900">
            Semua cerita favorit-mu
          </h2>
          <p className="text-gray-500 mt-1 text-sm md:text-base">
            Kamu dapat menekan tombol di sampul cerita untuk mengubah cerita
            favoritmu
          </p>
        </div>
      )}

      {/* Header Khusus Tab Disimpan */}
      {activeFilter === "disimpan" && (
        <div className="mx-3 md:mx-20 lg:mx-42 px-6 mt-12">
          <h2 className="text-2xl font-bold text-gray-900">
            Disimpan untuk nanti
          </h2>
          <p className="text-gray-500 mt-1 text-sm md:text-base">
            {progressData["Disimpan"]?.length || 0} cerita menunggumu untuk
            dibaca.
          </p>
        </div>
      )}

      {/* Menampilkan status loading sederhana */}
      {isLoading ? (
        <div className="mx-3 md:mx-20 lg:mx-42 px-6 py-20 text-center text-gray-400 font-medium animate-pulse">
          Memuat data {activeFilter}...
        </div>
      ) : (
        <Progress data={progressData} search={search} type={activeFilter} />
      )}

      <CtaDownload />
    </div>
  );
};

export default Corner;
