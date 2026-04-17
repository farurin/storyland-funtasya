import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserProfile } from "../services/api";

const ProfileAchievement = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchStats = async () => {
      try {
        const data = await getUserProfile(token);
        setStats(data);
      } catch (err) {
        console.error("Gagal ambil data rekor:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  // Menggunakan file statis lokal
  const badges = [
    {
      id: 1,
      name: "Good Job",
      image: "/images/badges/badge-goodjob.png",
      isUnlocked: true,
    },
    {
      id: 2,
      name: "Excellent",
      image: "/images/badges/badge-exellent.png",
      isUnlocked: true,
    },
    {
      id: 3,
      name: "Outstanding",
      image: "/images/badges/badge-outstanding.png",
      isUnlocked: true,
    },
    {
      id: 4,
      name: "Brilliant",
      image: "/images/badges/badge-brilliant.png",
      isUnlocked: false,
    },
    {
      id: 5,
      name: "Well Done",
      image: "/images/badges/badge-welldone.png",
      isUnlocked: false,
    },
    {
      id: 6,
      name: "Superb",
      image: "/images/badges/badge-superb.png",
      isUnlocked: false,
    },
  ];

  if (isLoading) {
    return (
      <div className="text-center py-20 animate-pulse text-purple-600 font-bold text-sm md:text-base">
        Memuat Rekor Pribadi...
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in px-2 md:px-0">
      {/* SECTION REKOR PRIBADI */}
      <div className="mb-10 md:mb-12">
        <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-4 md:mb-6 text-left">
          Rekor Pribadi
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
          {/* Box 1 */}
          <div className="bg-[#EAE8F0] border-[1.5px] border-[#A898FF] rounded-[20px] md:rounded-2xl p-5 md:p-8 flex flex-col justify-end min-h-25 md:min-h-35 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg md:text-2xl font-bold text-black mb-0.5 md:mb-1 leading-tight">
              Bergabung Sejak
            </h3>
            <p className="text-[11px] md:text-sm text-gray-600 font-medium">
              10 April 2026
            </p>
          </div>

          {/* Box 2 */}
          <div className="bg-[#EAE8F0] border-[1.5px] border-[#A898FF] rounded-[20px] md:rounded-2xl p-5 md:p-8 flex flex-col justify-end min-h-25 md:min-h-35 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg md:text-2xl font-bold text-black mb-0.5 md:mb-1 leading-tight">
              Total Poin
            </h3>
            <p className="text-[11px] md:text-sm text-gray-600 font-medium">
              {stats?.total_points || 0} XP Terkumpul
            </p>
          </div>

          {/* Box 3 */}
          <div className="bg-[#EAE8F0] border-[1.5px] border-[#A898FF] rounded-[20px] md:rounded-2xl p-5 md:p-8 flex flex-col justify-end min-h-25 md:min-h-35 shadow-sm hover:shadow-md transition-shadow sm:col-span-2 md:col-span-1">
            <h3 className="text-lg md:text-2xl font-bold text-black mb-0.5 md:mb-1 leading-tight">
              Streaks Saat Ini
            </h3>
            <p className="text-[11px] md:text-sm text-gray-600 font-medium">
              {stats?.current_streak || 0} Hari Aktif
            </p>
          </div>
        </div>
      </div>

      {/* SECTION PENGHARGAAN (BADGES) */}
      <div>
        <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-4 md:mb-6 text-left">
          Penghargaan
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-6">
          {badges.map((badge) => (
            <div key={badge.id} className="aspect-square">
              {badge.isUnlocked ? (
                // Badge Terbuka
                <div className="w-full h-full rounded-full overflow-hidden shadow-sm bg-white border-2 border-purple-100 p-1 md:p-1.5 hover:scale-105 transition-transform cursor-pointer">
                  <img
                    src={badge.image}
                    alt={badge.name}
                    className="w-full h-full object-contain"
                    onError={(e) =>
                      (e.target.src =
                        "https://via.placeholder.com/100?text=Badge")
                    }
                  />
                </div>
              ) : (
                // Badge Terkunci
                <div className="w-full h-full rounded-full bg-[#D1D1D6] overflow-hidden flex items-center justify-center shadow-inner opacity-80 p-1 md:p-1.5 border border-gray-300">
                  <img
                    src={badge.image}
                    alt={badge.name}
                    className="w-full h-full object-contain grayscale opacity-40"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileAchievement;
