import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const ProfileAchievement = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:5000/api/user/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Gagal ambil data rekor:", err);
        setIsLoading(false);
      });
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
      <div className="text-center py-20 animate-pulse text-purple-600 font-bold">
        Memuat Rekor Pribadi...
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in">
      {/* section personal rekor */}
      <div className="mb-12">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-6 text-left">
          Rekor Pribadi
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          <div className="bg-[#EAE8F0] border-[1.5px] border-[#A898FF] rounded-2xl p-6 md:p-8 flex flex-col justify-end min-h-35 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl md:text-2xl font-bold text-black mb-1">
              Bergabung Sejak
            </h3>
            <p className="text-xs md:text-sm text-gray-600 font-medium">
              10 April 2026
            </p>
          </div>

          <div className="bg-[#EAE8F0] border-[1.5px] border-[#A898FF] rounded-2xl p-6 md:p-8 flex flex-col justify-end min-h-35 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl md:text-2xl font-bold text-black mb-1">
              Total Poin
            </h3>
            <p className="text-xs md:text-sm text-gray-600 font-medium">
              {stats?.total_points || 0} XP Terkumpul
            </p>
          </div>

          <div className="bg-[#EAE8F0] border-[1.5px] border-[#A898FF] rounded-2xl p-6 md:p-8 flex flex-col justify-end min-h-35 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl md:text-2xl font-bold text-black mb-1">
              Streaks Saat Ini
            </h3>
            <p className="text-xs md:text-sm text-gray-600 font-medium">
              {stats?.current_streak || 0} Hari Aktif
            </p>
          </div>
        </div>
      </div>

      {/* section badges */}
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-6 text-left">
          Penghargaan
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 md:gap-6">
          {badges.map((badge) => (
            <div key={badge.id} className="aspect-square">
              {badge.isUnlocked ? (
                <div className="w-full h-full rounded-full overflow-hidden shadow-sm bg-white border-2 border-purple-100 p-1 hover:scale-105 transition-transform cursor-pointer">
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
                <div className="w-full h-full rounded-full bg-[#D1D1D6] overflow-hidden flex items-center justify-center shadow-inner opacity-80">
                  <img
                    src={badge.image}
                    alt={badge.name}
                    className="w-full h-full object-cover grayscale opacity-40"
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
