import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getLeaderboard } from "../services/api";
import { getImageUrl } from "../utils/getImageUrl";

// svg piala
const IconBigTrophy = () => (
  <svg
    viewBox="0 10 100 85"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full drop-shadow-md"
  >
    <path d="M30 85 h40 v10 h-40 z" fill="#8B5A2B" />
    <path d="M35 75 h30 v10 h-30 z" fill="#A0522D" />
    <path d="M42 87 h16 v6 h-16 z" fill="#FDE047" />
    <path d="M45 60 h10 v15 h-10 z" fill="#F59E0B" />
    <path d="M25 25 c0 25 10 35 25 35 c15 0 25 -10 25 -35 z" fill="#FBBF24" />
    <path d="M25 25 h50 v5 h-50 z" fill="#FDE047" />
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

  const getLastMondayDate = () => {
    const today = new Date();
    const day = today.getDay();
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
    return `${lastMonday.getDate()} ${months[lastMonday.getMonth()]}`;
  };

  useEffect(() => {
    if (!token) return;

    const fetchLeaderboard = async () => {
      try {
        const data = await getLeaderboard(token);
        setLeaderboardData(data);
      } catch (err) {
        console.error("Gagal mengambil leaderboard:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [token]);

  if (isLoading) {
    return (
      <div className="text-center py-20 text-purple-600 font-bold animate-pulse text-sm md:text-base">
        Memuat Papan Peringkat...
      </div>
    );
  }

  const top3 = leaderboardData.slice(0, 3);
  const tableData = leaderboardData.slice(3);

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in px-2 md:px-0">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #EAE8F0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #A898FF; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #6B4EFF; }
      `}</style>

      {/* SECTION ATAS (Banner & Top 3) */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-6 md:mb-8">
        {/* Banner Piala */}
        <div className="flex-1 bg-[#F4F3FF] rounded-3xl md:rounded-3xl p-5 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 md:gap-6 shadow-sm border border-white/50">
          <div className="w-24 md:w-40 shrink-0">
            <IconBigTrophy />
          </div>
          <div className="text-center sm:text-right w-full sm:w-auto">
            <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 mb-1 md:mb-2">
              Papan Peringkat
            </h2>
            <p className="text-[11px] md:text-sm text-gray-900 font-bold mb-4 md:mb-8 sm:max-w-70 sm:ml-auto leading-relaxed">
              Peringkat diperbarui secara berkala setiap Senin pukul 00:00 WIB
            </p>
            <p className="text-[9px] md:text-[10px] lg:text-xs text-gray-700 font-medium bg-white/60 inline-block px-3 py-1 rounded-full sm:bg-transparent sm:px-0 sm:py-0">
              Terakhir diperbarui: {getLastMondayDate()}, 00:00 WIB
            </p>
          </div>
        </div>

        {/* Kotak Top 3 */}
        <div className="w-full md:w-1/3 bg-[#F4F3FF] rounded-3xl md:rounded-3xl p-5 md:p-6 shadow-sm border border-white/50 flex flex-col items-center justify-center">
          <h3 className="text-lg md:text-xl font-extrabold text-gray-900 mb-4 md:mb-6">
            TOP 3
          </h3>

          <div className="flex items-end justify-center gap-2 sm:gap-3 md:gap-5 w-full">
            {/* Rank 3 */}
            {top3[2] && (
              <div className="flex flex-col items-center pb-2 shrink-0">
                <IconSolidCrown className="w-5 h-5 md:w-6 md:h-6 -mb-2 md:-mb-2.5 z-10" />
                <div className="relative">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-full border-[3px] border-[#6B4EFF] overflow-hidden shadow-md">
                    <img
                      // helper untuk avatar Top 3
                      src={getImageUrl(top3[2].avatar)}
                      alt="Rank 3"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1.5 md:-bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 md:w-5 md:h-5 bg-[#6B4EFF] text-white text-[9px] md:text-[10px] font-bold rounded-full flex items-center justify-center border border-white">
                    3
                  </div>
                </div>
              </div>
            )}

            {/* Rank 1 */}
            {top3[0] && (
              <div className="flex flex-col items-center shrink-0">
                <IconSolidCrown className="w-7 h-7 md:w-8 md:h-8 -mb-2 md:-mb-3 z-10" />
                <div className="relative">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full border-4 border-[#6B4EFF] overflow-hidden shadow-lg">
                    <img
                      // helper untuk avatar Top 1
                      src={getImageUrl(top3[0].avatar)}
                      alt="Rank 1"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 md:-bottom-2.5 left-1/2 -translate-x-1/2 w-5 h-5 md:w-6 md:h-6 bg-[#6B4EFF] text-white text-[10px] md:text-xs font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                    1
                  </div>
                </div>
              </div>
            )}

            {/* Rank 2 */}
            {top3[1] && (
              <div className="flex flex-col items-center pb-2 shrink-0">
                <IconSolidCrown className="w-5 h-5 md:w-6 md:h-6 -mb-2 md:-mb-2.5 z-10" />
                <div className="relative">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-full border-[3px] border-[#6B4EFF] overflow-hidden shadow-md">
                    <img
                      // helper untuk avatar Top 2
                      src={getImageUrl(top3[1].avatar)}
                      alt="Rank 2"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1.5 md:-bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 md:w-5 md:h-5 bg-[#6B4EFF] text-white text-[9px] md:text-[10px] font-bold rounded-full flex items-center justify-center border border-white">
                    2
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION TABEL */}
      <div className="bg-white rounded-2xl md:rounded-3xl p-3 md:p-6 shadow-sm border border-gray-100">
        <div className="w-full overflow-x-auto custom-scrollbar">
          <div className="min-w-125 md:min-w-0 grid grid-cols-[1fr_3fr_1.5fr_1.5fr_1.5fr] gap-2 md:gap-4 text-center font-bold text-[10px] md:text-xs lg:text-sm text-gray-900 pb-3 md:pb-4 border-b border-gray-200 px-2 md:px-4">
            <div>Ranking</div>
            <div className="text-left">Nama</div>
            <div>Streak Harian</div>
            <div>Total Halaman</div>
            <div>Total Penghargaan</div>
          </div>

          {/* Isi Tabel */}
          <div className="min-w-125 md:min-w-0 max-h-75 md:max-h-100 overflow-y-auto custom-scrollbar pr-1 md:pr-2 mt-2">
            {tableData.length > 0 ? (
              tableData.map((user, index) => (
                <div
                  key={user.rank}
                  className={`grid grid-cols-[1fr_3fr_1.5fr_1.5fr_1.5fr] gap-2 md:gap-4 items-center text-center py-2.5 md:py-3 px-2 md:px-4 rounded-xl text-[11px] md:text-xs lg:text-sm font-bold text-gray-800 ${
                    index % 2 === 0 ? "bg-white" : "bg-[#F8F7FF]"
                  }`}
                >
                  <div className="text-gray-500">{user.rank}</div>
                  <div className="flex items-center gap-2 md:gap-3 text-left">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-200 overflow-hidden shrink-0 border border-white shadow-sm">
                      <img
                        // helper untuk avatar peserta lain
                        src={getImageUrl(user.avatar)}
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
              <div className="text-center py-8 text-gray-400 font-medium text-xs md:text-sm">
                Belum ada data peringkat lainnya.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLeaderboard;
