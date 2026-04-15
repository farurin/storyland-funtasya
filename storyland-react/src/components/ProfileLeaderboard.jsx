import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

// svg piala
const IconBigTrophy = () => (
  <svg
    viewBox="0 10 100 85"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full drop-shadow-md"
  >
    {/* Base Bawah (Coklat) */}
    <path d="M30 85 h40 v10 h-40 z" fill="#8B5A2B" />
    <path d="M35 75 h30 v10 h-30 z" fill="#A0522D" />
    {/* Plakat Emas di Base */}
    <path d="M42 87 h16 v6 h-16 z" fill="#FDE047" />
    {/* Batang Piala */}
    <path d="M45 60 h10 v15 h-10 z" fill="#F59E0B" />
    {/* Mangkuk Piala */}
    <path d="M25 25 c0 25 10 35 25 35 c15 0 25 -10 25 -35 z" fill="#FBBF24" />
    <path d="M25 25 h50 v5 h-50 z" fill="#FDE047" />
    {/* Telinga Piala */}
    <path
      d="M25 30 c-15 0 -15 20 0 20"
      stroke="#FBBF24"
      strokeWidth="6"
      strokeLinecap="round"
    />
    <path
      d="M75 30 c15 0 15 20 0 20"
      stroke="#FBBF24"
      strokeWidth="6"
      strokeLinecap="round"
    />
    {/* Highlight Cahaya */}
    <path d="M40 30 h10 v20 h-10 z" fill="#FDE047" opacity="0.4" />
  </svg>
);

// mahkota ungu
const IconSolidCrown = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="#6B4EFF"
    className={className}
  >
    <path d="M2 22h20v-2H2v2zm19-15.5l-4 3-3-5.5-3 5.5-4-3 2.5 8.5h9l2.5-8.5z" />
  </svg>
);

const ProfileLeaderboard = () => {
  const { token } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // fungsi ambil senin terakhir
  const getLastMondayDate = () => {
    const today = new Date();
    const day = today.getDay(); // 0 = Minggu, 1 = Senin, dst.
    // Jika hari ini Minggu (0), mundur 6 hari. Jika hari lain, mundur ke hari Senin (1)
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);

    const lastMonday = new Date(today.setDate(diff));
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Ags",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];

    return `${lastMonday.getDate()} ${months[lastMonday.getMonth()]}`; // Output: "25 Okt"
  };

  useEffect(() => {
    if (!token) return;

    fetch(`${import.meta.env.VITE_API_URL}/user/leaderboard`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setLeaderboardData(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Gagal mengambil leaderboard:", err);
        setIsLoading(false);
      });
  }, [token]);

  if (isLoading) {
    return (
      <div className="text-center py-20 text-purple-600 font-bold animate-pulse">
        Memuat Papan Peringkat...
      </div>
    );
  }

  // Pisahkan Top 3 dan sisanya
  const top3 = leaderboardData.slice(0, 3);
  const tableData = leaderboardData.slice(3);

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #EAE8F0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #A898FF; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #6B4EFF; }
      `}</style>

      {/* bagian atas */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        {/* kiri: penjelasan papan peringkat */}
        <div className="flex-1 bg-[#F4F3FF] rounded-3xl p-6 md:p-8 flex items-center justify-between gap-6 shadow-sm border border-white/50">
          <div className="w-32 md:w-40 shrink-0">
            <IconBigTrophy />
          </div>
          <div className="text-right">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
              Papan Peringkat
            </h2>
            <p className="text-xs md:text-sm text-gray-900 font-bold mb-8 max-w-70 ml-auto leading-relaxed">
              Peringkat diperbarui secara berkala setiap Senin pukul 00:00 WIB
            </p>
            <p className="text-[10px] md:text-xs text-gray-700 font-medium">
              Terakhir diperbarui: {getLastMondayDate()}, 00:00 WIB
            </p>
          </div>
        </div>

        {/* kanan: Top 3 */}
        <div className="w-full md:w-1/3 bg-[#F4F3FF] rounded-3xl p-6 shadow-sm border border-white/50 flex flex-col items-center justify-center">
          <h3 className="text-xl font-extrabold text-gray-900 mb-6">TOP 3</h3>

          <div className="flex items-end justify-center gap-3 md:gap-5 w-full">
            {/* Peringkat 3 (Posisi Kiri) */}
            {top3[2] && (
              <div className="flex flex-col items-center pb-2 shrink-0">
                <IconSolidCrown className="w-6 h-6 -mb-2.5 z-10" />
                <div className="relative">
                  <div className="w-14 h-14 bg-white rounded-full border-[3px] border-[#6B4EFF] overflow-hidden shadow-md">
                    <img
                      src={top3[2].avatar || "/images/avatars/cat-avatar.png"}
                      alt="Rank 3"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 bg-[#6B4EFF] text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white">
                    3
                  </div>
                </div>
              </div>
            )}

            {/* Peringkat 1 (Posisi Tengah) */}
            {top3[0] && (
              <div className="flex flex-col items-center shrink-0">
                <IconSolidCrown className="w-8 h-8 -mb-3 z-10" />
                <div className="relative">
                  <div className="w-20 h-20 bg-white rounded-full border-4 border-[#6B4EFF] overflow-hidden shadow-lg">
                    <img
                      src={top3[0].avatar || "/images/avatars/cat-avatar.png"}
                      alt="Rank 1"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#6B4EFF] text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                    1
                  </div>
                </div>
              </div>
            )}

            {/* Peringkat 2 (Posisi Kanan) */}
            {top3[1] && (
              <div className="flex flex-col items-center pb-2 shrink-0">
                <IconSolidCrown className="w-6 h-6 -mb-2.5 z-10" />
                <div className="relative">
                  <div className="w-14 h-14 bg-white rounded-full border-[3px] border-[#6B4EFF] overflow-hidden shadow-md">
                    <img
                      src={top3[1].avatar || "/images/avatars/cat-avatar.png"}
                      alt="Rank 2"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 bg-[#6B4EFF] text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white">
                    2
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* bagian bawah: Tabel */}
      <div className="bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-gray-100">
        <div className="grid grid-cols-[1fr_3fr_1.5fr_1.5fr_1.5fr] gap-4 text-center font-bold text-xs md:text-sm text-gray-900 pb-4 border-b border-gray-200 px-4">
          <div>Ranking</div>
          <div className="text-left">Nama</div>
          <div>Streak Harian</div>
          <div>Total Halaman</div>
          <div>Total Penghargaan</div>
        </div>

        <div className="max-h-100 overflow-y-auto custom-scrollbar pr-2 mt-2">
          {tableData.length > 0 ? (
            tableData.map((user, index) => (
              <div
                key={user.rank}
                className={`grid grid-cols-[1fr_3fr_1.5fr_1.5fr_1.5fr] gap-4 items-center text-center py-3 px-4 rounded-xl text-xs md:text-sm font-bold text-gray-800 ${
                  index % 2 === 0 ? "bg-white" : "bg-[#F8F7FF]"
                }`}
              >
                <div className="text-gray-500">{user.rank}</div>
                <div className="flex items-center gap-3 text-left">
                  <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden shrink-0 border border-white shadow-sm">
                    <img
                      src={user.avatar || "/images/avatars/cat-avatar.png"}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="truncate">{user.name}</span>
                </div>
                <div>{user.streak}</div>
                <div>{user.pages}</div>
                <div>{user.awards}</div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-400 font-medium">
              Belum ada data peringkat lainnya.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileLeaderboard;
