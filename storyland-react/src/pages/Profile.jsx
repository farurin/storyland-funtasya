import React, { useState } from "react";
import CtaDownload from "../components/CtaDownload";

// --- KUMPULAN IKON SVG ---
const IconEdit = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const IconFire = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="#FF8A00"
    stroke="#FF8A00"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
);

const IconMedal = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#E3B341"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="8" r="7" fill="#FDECA2" />
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" fill="#FDECA2" />
  </svg>
);

const IconPodium = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#E3B341"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="10" y="9" width="4" height="11" fill="#FDECA2" />
    <rect x="4" y="14" width="4" height="6" fill="#FDECA2" />
    <rect x="16" y="12" width="4" height="8" fill="#FDECA2" />
  </svg>
);

const Profile = () => {
  // State untuk Tab Menu yang sedang aktif
  const [activeTab, setActiveTab] = useState("Status");

  const tabs = ["Status", "Pencapaian", "Papan Ranking", "Misi"];

  // Data tiruan untuk kalender streak
  const streakDays = [
    { day: "Min", date: 10, isActive: true, isToday: true },
    { day: "Sen", date: 11, isActive: true, isToday: false },
    { day: "Sel", date: 12, isActive: true, isToday: false },
    { day: "Rab", date: 13, isActive: false, isToday: false },
    { day: "Kam", date: 14, isActive: false, isToday: false },
    { day: "Jum", date: 15, isActive: false, isToday: false },
    { day: "Sab", date: 16, isActive: false, isToday: false },
  ];

  return (
    <div className="w-full">
      <div className="max-w-6xl mx-auto px-6 pt-12 pb-20">
        {/* 1. JUDUL PROFIL */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 mb-8">
          Profile
        </h1>

        {/* 2. TAB MENU (Pill Navbar) */}
        <div className="flex justify-center mb-16">
          <div className="bg-[#6B4EFF] flex items-center p-1.5 rounded-full overflow-x-auto max-w-full">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 md:px-8 py-2.5 rounded-full font-bold text-sm md:text-base whitespace-nowrap transition-all ${
                  activeTab === tab
                    ? "bg-white text-[#6B4EFF] shadow-sm"
                    : "text-white hover:bg-white/10"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* 3. KONTEN TAB: STATUS */}
        {activeTab === "Status" && (
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center justify-center">
            {/* KIRI: Ilustrasi & Tombol Ubah Maskot */}
            <div className="flex flex-col items-center shrink-0">
              <div className="w-64 h-64 md:w-80 md:h-80 relative mb-6">
                <img
                  src="/images/characters/cat-reading.png"
                  alt="Maskot Profil"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/300x300?text=Kucing+Baca+Buku";
                  }}
                />
              </div>
              <button className="bg-[#6B4EFF] text-white font-bold py-2.5 px-12 rounded-full hover:bg-purple-700 transition shadow-md">
                Ubah
              </button>
            </div>

            {/* KANAN: Kartu Status (Light Purple) */}
            <div className="w-full max-w-xl bg-[#F4F3FF] rounded-[40px] p-6 md:p-8 relative shadow-sm border border-white/50">
              {/* Tombol Ubah Profil di Kanan Atas */}
              <button className="absolute top-6 right-6 md:top-8 md:right-8 flex items-center gap-1.5 bg-white px-4 py-1.5 rounded-full text-xs font-bold text-gray-600 border border-gray-200 hover:bg-gray-50 transition shadow-sm">
                <IconEdit /> Ubah
              </button>

              {/* Header Kartu: Avatar & Nama */}
              <div className="flex items-center gap-5 md:gap-6 mb-10">
                {/* Lingkaran Avatar */}
                <div className="relative">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-pink-100 rounded-full border-4 border-white overflow-hidden shadow-sm">
                    <img
                      src="/images/avatars/cat-avatar.png"
                      alt="Avatar"
                      className="w-full h-full object-cover"
                      onError={(e) =>
                        (e.target.src =
                          "https://via.placeholder.com/100x100?text=Avatar")
                      }
                    />
                  </div>
                  {/* Badge Api di pojok avatar */}
                  <div className="absolute top-0 right-0 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md">
                    <IconFire />
                  </div>
                </div>

                {/* Nama & Umur */}
                <div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
                    Budi
                  </h2>
                  <p className="text-sm md:text-base font-semibold text-gray-600 mt-1">
                    10 Tahun
                  </p>
                </div>
              </div>

              {/* Baris Statistik (Streak, Pencapaian, Peringkat) */}
              <div className="flex items-center gap-6 md:gap-10 mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <IconFire />
                  </div>
                  <div>
                    <h4 className="text-xl md:text-2xl font-extrabold text-gray-900 leading-none">
                      10
                    </h4>
                    <p className="text-[10px] md:text-xs font-bold text-gray-500">
                      Streak Harian
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <IconMedal />
                  </div>
                  <div>
                    <h4 className="text-xl md:text-2xl font-extrabold text-gray-900 leading-none">
                      10
                    </h4>
                    <p className="text-[10px] md:text-xs font-bold text-gray-500">
                      Pencapaian
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <IconPodium />
                  </div>
                  <div>
                    <h4 className="text-xl md:text-2xl font-extrabold text-gray-900 leading-none">
                      10
                    </h4>
                    <p className="text-[10px] md:text-xs font-bold text-gray-500">
                      Peringkat
                    </p>
                  </div>
                </div>
              </div>

              {/* Baris Kalender Streak */}
              <div className="flex justify-between items-center bg-white/40 p-2 rounded-3xl">
                {streakDays.map((item, index) => (
                  <div
                    key={index}
                    className={`flex flex-col items-center justify-center w-10 md:w-14 h-16 md:h-20 rounded-2xl transition-all ${
                      item.isActive
                        ? "bg-[#DFDAFE] shadow-sm"
                        : "bg-transparent"
                    }`}
                  >
                    {/* Indikator titik hitam (isToday) */}
                    <div className="h-2 mb-1">
                      {item.isToday && (
                        <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                      )}
                    </div>
                    <span className="text-[10px] md:text-xs font-bold text-gray-600 mb-1">
                      {item.day}
                    </span>
                    <span className="text-sm md:text-lg font-extrabold text-gray-900">
                      {item.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TEMPAT UNTUK TAB LAINNYA NANTI */}
        {activeTab === "Pencapaian" && (
          <div className="text-center text-gray-500 py-20 font-bold">
            Halaman Pencapaian Segera Hadir!
          </div>
        )}
        {activeTab === "Papan Ranking" && (
          <div className="text-center text-gray-500 py-20 font-bold">
            Halaman Papan Ranking Segera Hadir!
          </div>
        )}
        {activeTab === "Misi" && (
          <div className="text-center text-gray-500 py-20 font-bold">
            Halaman Misi Segera Hadir!
          </div>
        )}
      </div>

      {/* 4. CTA DOWNLOAD BAWAH */}
      <CtaDownload />
    </div>
  );
};

export default Profile;
