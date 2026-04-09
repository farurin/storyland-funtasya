import React from "react";

// --- IKON SVG MAHKOTA UNTUK TOP 3 ---
const IconCrown = ({ color }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill={color}
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="2 20 22 20 19 6 15 13 12 4 9 13 5 6 2 20" />
  </svg>
);

const ProfileLeaderboard = () => {
  // Generate Data Peringkat 1-30
  const leaderboardData = Array.from({ length: 30 }, (_, i) => ({
    rank: i + 1,
    name: `Pengguna ${i + 1}`,
    avatar: `/images/avatars/cat-avatar-${(i % 3) + 1}.png`, // Gambar avatar diseling-seling
    streak: Math.max(15 - Math.floor(i / 2), 1), // Angka streak menurun
    pages: Math.max(40 - i, 10), // Angka halaman menurun
    awards: Math.max(5 - Math.floor(i / 5), 1), // Angka penghargaan menurun
  }));

  const top3 = leaderboardData.slice(0, 3); // Ambil 3 teratas
  const tableData = leaderboardData.slice(3); // Sisanya untuk tabel

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in">
      {/* --- CSS KHUSUS SCROLLBAR UNGU --- */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #EAE8F0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #A898FF;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6B4EFF;
        }
      `}</style>

      {/* 1. BAGIAN ATAS: Penjelasan & Top 3 */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        {/* KIRI: Penjelasan Papan Peringkat */}
        <div className="flex-1 bg-[#F4F3FF] rounded-3xl p-6 md:p-8 flex items-center gap-6 shadow-sm border border-white/50">
          <div className="w-32 md:w-40 shrink-0">
            {/* Menggunakan emoji/fallback jika gambar piala tidak ada */}
            <img
              src="/images/trophy.png"
              alt="Trophy"
              className="w-full object-contain"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.parentElement.innerHTML =
                  '<div class="text-7xl md:text-8xl text-center">🏆</div>';
              }}
            />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">
              Papan Peringkat
            </h2>
            <p className="text-xs md:text-sm text-gray-700 font-medium mb-6">
              Peringkat diperbarui secara berkala setiap Senin pukul 00:00 WIB
            </p>
            <p className="text-[10px] md:text-xs text-gray-500 font-semibold">
              Terakhir diperbarui: 25 Okt, 14:30 WIB
            </p>
          </div>
        </div>

        {/* KANAN: Top 3 */}
        <div className="w-full md:w-1/3 bg-[#F4F3FF] rounded-3xl p-6 shadow-sm border border-white/50 flex flex-col items-center justify-center">
          <h3 className="text-lg font-extrabold text-gray-900 mb-4">TOP 3</h3>

          <div className="flex items-end justify-center gap-2 md:gap-4 w-full">
            {/* Peringkat 2 (Kiri) */}
            <div className="flex flex-col items-center pb-2">
              <div className="text-[#A0AEC0] mb-1 scale-75">
                <IconCrown color="#E2E8F0" />
              </div>
              <div className="relative">
                <div className="w-14 h-14 bg-white rounded-full border-[3px] border-[#A0AEC0] overflow-hidden shadow-md">
                  <img
                    src={top3[1].avatar}
                    alt="Rank 2"
                    onError={(e) =>
                      (e.target.src =
                        "https://ui-avatars.com/api/?name=R2&background=A0AEC0")
                    }
                  />
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 bg-[#A0AEC0] text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white">
                  2
                </div>
              </div>
            </div>

            {/* Peringkat 1 (Tengah - Paling Besar) */}
            <div className="flex flex-col items-center">
              <div className="text-[#F6E05E] mb-1 scale-110">
                <IconCrown color="#FDE047" />
              </div>
              <div className="relative">
                <div className="w-20 h-20 bg-white rounded-full border-4 border-[#F6E05E] overflow-hidden shadow-lg">
                  <img
                    src={top3[0].avatar}
                    alt="Rank 1"
                    onError={(e) =>
                      (e.target.src =
                        "https://ui-avatars.com/api/?name=R1&background=F6E05E")
                    }
                  />
                </div>
                <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#6B4EFF] text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  1
                </div>
              </div>
            </div>

            {/* Peringkat 3 (Kanan) */}
            <div className="flex flex-col items-center pb-2">
              <div className="text-[#ED8936] mb-1 scale-75">
                <IconCrown color="#FBD38D" />
              </div>
              <div className="relative">
                <div className="w-14 h-14 bg-white rounded-full border-[3px] border-[#ED8936] overflow-hidden shadow-md">
                  <img
                    src={top3[2].avatar}
                    alt="Rank 3"
                    onError={(e) =>
                      (e.target.src =
                        "https://ui-avatars.com/api/?name=R3&background=ED8936")
                    }
                  />
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 bg-[#ED8936] text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white">
                  3
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. BAGIAN BAWAH: Tabel Peringkat */}
      <div className="bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-gray-100">
        {/* Header Tabel */}
        <div className="grid grid-cols-[1fr_3fr_1.5fr_1.5fr_1.5fr] gap-4 text-center font-bold text-xs md:text-sm text-gray-900 pb-4 border-b border-gray-200 px-4">
          <div>Ranking</div>
          <div className="text-left">Nama</div>
          <div>Streak Harian</div>
          <div>Total Halaman</div>
          <div>Total Penghargaan</div>
        </div>

        {/* Body Tabel (Bisa di-scroll) */}
        <div className="max-h-100 overflow-y-auto custom-scrollbar pr-2 mt-2">
          {tableData.map((user, index) => (
            <div
              key={user.rank}
              // Baris selang-seling: baris genap (putih), baris ganjil (ungu muda pudar)
              className={`grid grid-cols-[1fr_3fr_1.5fr_1.5fr_1.5fr] gap-4 items-center text-center py-3 px-4 rounded-xl text-xs md:text-sm font-bold text-gray-800 ${
                index % 2 === 0 ? "bg-white" : "bg-[#F8F7FF]"
              }`}
            >
              <div className="text-gray-500">{user.rank}</div>

              {/* Kolom Nama dengan Avatar */}
              <div className="flex items-center gap-3 text-left">
                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden shrink-0 border border-white shadow-sm">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                    onError={(e) =>
                      (e.target.src = `https://ui-avatars.com/api/?name=${user.name.replace(" ", "+")}&background=random`)
                    }
                  />
                </div>
                <span className="truncate">{user.name}</span>
              </div>

              <div>{user.streak}</div>
              <div>{user.pages}</div>
              <div>{user.awards}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileLeaderboard;
