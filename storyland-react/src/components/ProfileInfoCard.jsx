import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

// icon svg
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

const ProfileInfoCard = () => {
  const { token } = useAuth();
  const [profileData, setProfileData] = useState(null);

  // Generate 7 hari kalender dinamis (berdasarkan hari ini)
  const getWeekDays = () => {
    const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    let result = [];
    let today = new Date();

    // Tarik mundur 3 hari ke belakang, lalu 3 hari ke depan
    for (let i = -3; i <= 3; i++) {
      let d = new Date(today);
      d.setDate(today.getDate() + i);
      result.push({
        day: days[d.getDay()],
        date: d.getDate(),
        isToday: i === 0,
        // Logika dummy: jika hari ini atau sblmnya, dianggap aktif
        isActive: i <= 0,
      });
    }
    return result;
  };

  const streakDays = getWeekDays();

  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:5000/api/user/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setProfileData(data))
      .catch((err) => console.error("Gagal ambil profil:", err));
  }, [token]);

  if (!profileData) {
    return (
      <div className="w-full bg-[#F4F3FF] rounded-[40px] p-8 flex justify-center items-center h-100 animate-pulse">
        Memuat Data...
      </div>
    );
  }

  return (
    <div className="w-full bg-[#F4F3FF] rounded-[40px] p-6 md:p-8 relative shadow-sm border border-white/50 animate-fade-in flex flex-col justify-between min-h-100">
      {/* Tombol Ubah Profil (Nantinya memanggil Modal Edit) */}
      <button
        onClick={() => alert("Fitur Edit Profil akan segera dibuat!")}
        className="absolute top-6 right-6 md:top-8 md:right-8 flex items-center gap-1.5 bg-white px-4 py-1.5 rounded-full text-xs font-bold text-gray-600 border border-gray-200 hover:bg-gray-50 transition shadow-sm"
      >
        <IconEdit /> Ubah
      </button>

      {/* Info Dasar */}
      <div className="flex items-center gap-5 md:gap-6 mb-10 mt-2">
        <div className="relative">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-pink-100 rounded-full border-4 border-white overflow-hidden shadow-sm">
            <img
              src={profileData.avatar_url}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute top-0 right-0 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md">
            <IconFire />
          </div>
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
            {profileData.username}
          </h2>
          <p className="text-sm md:text-base font-semibold text-gray-600 mt-1">
            {profileData.age > 0
              ? `${profileData.age} Tahun`
              : "Umur belum diatur"}
          </p>
        </div>
      </div>

      {/* Statistik */}
      <div className="flex items-center gap-6 md:gap-10 mb-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
            <IconFire />
          </div>
          <div>
            <h4 className="text-xl md:text-2xl font-extrabold text-gray-900 leading-none">
              {profileData.current_streak}
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
              {profileData.total_achievements}
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
              {profileData.rank}
            </h4>
            <p className="text-[10px] md:text-xs font-bold text-gray-500">
              Peringkat
            </p>
          </div>
        </div>
      </div>

      {/* Kalender */}
      <div className="flex justify-between items-center bg-white/40 p-2 rounded-3xl">
        {streakDays.map((item, index) => (
          <div
            key={index}
            className={`flex flex-col items-center justify-center w-10 md:w-14 h-16 md:h-20 rounded-2xl transition-all ${item.isActive ? "bg-[#DFDAFE] shadow-sm" : "bg-transparent"}`}
          >
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
  );
};

export default ProfileInfoCard;
