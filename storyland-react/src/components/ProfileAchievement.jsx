import React from "react";

const ProfileAchievement = () => {
  // Data tiruan (Dummy Data) untuk Rekor Pribadi
  const personalRecords = [
    { title: "Bergabung Sejak", value: "27 Febfuary 2025" },
    { title: "Total Halaman", value: "88 Halaman (1 Bulan)" },
    { title: "Streaks Terlama", value: "9 Streaks berjalan" },
  ];

  // Data tiruan untuk Badge Penghargaan
  // isUnlocked: true (berwarna), false (abu-abu/terkunci)
  const badges = [
    {
      id: 1,
      name: "Good Job",
      image: "/images/badges/badge-1.png",
      isUnlocked: true,
    },
    {
      id: 2,
      name: "Excellent",
      image: "/images/badges/badge-2.png",
      isUnlocked: true,
    },
    {
      id: 3,
      name: "Outstanding",
      image: "/images/badges/badge-3.png",
      isUnlocked: true,
    },
    {
      id: 4,
      name: "Brilliant",
      image: "/images/badges/badge-4.png",
      isUnlocked: true,
    },
    {
      id: 5,
      name: "Well Done",
      image: "/images/badges/badge-5.png",
      isUnlocked: false,
    }, // Mode grayscale
    {
      id: 6,
      name: "Superb",
      image: "/images/badges/badge-6.png",
      isUnlocked: false,
    }, // Mode grayscale
    // Badge kosong/terkunci murni (abu-abu polos)
    { id: 7, name: "Locked", image: "", isUnlocked: false },
    { id: 8, name: "Locked", image: "", isUnlocked: false },
    { id: 9, name: "Locked", image: "", isUnlocked: false },
    { id: 10, name: "Locked", image: "", isUnlocked: false },
    { id: 11, name: "Locked", image: "", isUnlocked: false },
    { id: 12, name: "Locked", image: "", isUnlocked: false },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in">
      {/* 1. SECTION REKOR PRIBADI */}
      <div className="mb-12">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-6 text-left">
          Rekor Pribadi
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {personalRecords.map((record, index) => (
            <div
              key={index}
              className="bg-[#EAE8F0] border-[1.5px] border-[#A898FF] rounded-2xl p-6 md:p-8 flex flex-col justify-end min-h-35 md:min-h-40 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl md:text-2xl font-bold text-black mb-1">
                {record.title}
              </h3>
              <p className="text-xs md:text-sm text-gray-600 font-medium">
                {record.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. SECTION PENGHARGAAN (BADGES) */}
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-6 text-left">
          Penghargaan
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 md:gap-6">
          {badges.map((badge) => (
            <div key={badge.id} className="aspect-square">
              {badge.isUnlocked ? (
                // Badge Terbuka (Berwarna)
                <div className="w-full h-full rounded-full overflow-hidden shadow-sm hover:scale-105 transition-transform cursor-pointer bg-white">
                  <img
                    src={badge.image}
                    alt={badge.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback gambar bulat berwarna jika gambar asli tidak ada
                      e.target.src = `https://ui-avatars.com/api/?name=${badge.name.replace(" ", "+")}&background=random&color=fff&size=150&font-size=0.33`;
                    }}
                  />
                </div>
              ) : (
                // Badge Terkunci (Abu-abu / Grayscale)
                <div className="w-full h-full rounded-full bg-[#D1D1D6] overflow-hidden flex items-center justify-center shadow-inner opacity-80">
                  {badge.image ? (
                    <img
                      src={badge.image}
                      alt={badge.name}
                      className="w-full h-full object-cover grayscale opacity-50"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  ) : null}
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
