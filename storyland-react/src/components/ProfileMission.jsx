import React from "react";

// icon svg

const IconGift = ({ size = 40 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="#6B4EFF"
  >
    <rect x="3" y="8" width="18" height="4" rx="1" fill="#6B4EFF" />
    <path d="M4 12h16v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-9z" fill="#5838E5" />
    <path d="M12 2v6" stroke="#fff" strokeWidth="2" />
    <path
      d="M12 8c-2-3-5-3-5-1s3 2 5 1zm0 0c2-3 5-3 5-1s-3 2-5 1z"
      fill="#6B4EFF"
    />
    <line
      x1="12"
      y1="12"
      x2="12"
      y2="23"
      stroke="#4629B5"
      strokeWidth="2"
      opacity="0.3"
    />
  </svg>
);

const IconMedalRibbon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
  >
    <circle cx="12" cy="10" r="8" fill="#00D166" />
    <circle cx="12" cy="10" r="5" fill="#FDECA2" />
    <circle cx="12" cy="10" r="3" fill="#E3B341" />
    <path d="M9 16l-2 6 5-2 5 2-2-6" fill="#FDECA2" />
  </svg>
);

const IconSmallMedal = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="10" fill="#E3B341" />
    <circle cx="12" cy="12" r="6" fill="#FDECA2" />
    <circle cx="12" cy="12" r="3" fill="#fff" />
  </svg>
);

const ProfileMission = () => {
  // Data Dummy: Poin saat ini (Bisa diubah untuk melihat efek garis hijau di atas)
  const currentTotalPoints = 15;

  // Data Dummy: Daftar Misi
  const missions = [
    {
      id: 1,
      title: "Kutu Buku Lv. 1",
      desc: "Selesaikan 5 buku untuk dapatkan lencana ini!",
      progress: 5,
      maxProgress: 5,
      badgeImg: "/images/badges/badge-1.png",
      rewardPoints: 5,
      status: "claim", // claim = selesai & siap diambil
    },
    {
      id: 2,
      title: "Kutu Buku Lv. 2",
      desc: "Selesaikan 10 buku untuk dapatkan lencana ini!",
      progress: 5,
      maxProgress: 10,
      badgeImg: "/images/badges/badge-2.png",
      rewardPoints: 10,
      status: "progress", // progress = sedang berjalan
    },
    {
      id: 3,
      title: "Kutu Buku Lv. 3",
      desc: "Selesaikan 20 buku untuk dapatkan lencana ini!",
      progress: 5,
      maxProgress: 20,
      badgeImg: "/images/badges/badge-3.png",
      rewardPoints: 10,
      status: "progress",
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in">
      {/* Section top progress bar */}
      <div className="relative w-full pt-6 pb-12 px-2 md:px-6 mb-8 overflow-x-auto">
        <div className="min-w-150">
          {/* Garis Background (Ungu Muda) */}
          <div className="absolute top-[35%] md:top-[40%] left-[3%] right-[3%] h-6 md:h-8 bg-[#EAE8F0] -translate-y-1/2 z-0 rounded-full"></div>

          {/* Garis Progres (Hijau) */}
          <div
            className="absolute top-[35%] md:top-[40%] left-[3%] h-6 md:h-8 bg-[#00D166] -translate-y-1/2 z-0 rounded-full transition-all duration-1000"
            style={{
              width: `${Math.min((currentTotalPoints / 100) * 94, 94)}%`,
            }}
          ></div>

          {/* Titik Poin (Markers) */}
          <div className="relative z-10 flex justify-between items-end w-full px-2">
            <div className="flex flex-col items-center pb-1">
              <IconMedalRibbon />
              <span className="font-extrabold mt-2 text-base md:text-xl text-black">
                0
              </span>
            </div>

            {[20, 40, 60, 80].map((val) => (
              <div key={val} className="flex flex-col items-center">
                <IconGift size={44} />
                <span className="font-extrabold mt-2 text-base md:text-xl text-black">
                  {val}
                </span>
              </div>
            ))}

            <div className="flex flex-col items-center">
              <IconGift size={64} />
              <span className="font-extrabold mt-1 text-base md:text-xl text-black">
                100
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SECTION DAFTAR MISI */}
      <div className="flex flex-col gap-5 md:gap-6">
        {missions.map((mission) => {
          // Menghitung persentase bar hijau untuk tiap kartu misi
          const progressPercentage =
            (mission.progress / mission.maxProgress) * 100;

          return (
            <div
              key={mission.id}
              className="bg-[#F8F7FF] rounded-4xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-sm border border-gray-100 transition-transform hover:scale-[1.01]"
            >
              {/* Kiri: Info & Progress Bar Misi */}
              <div className="flex-1 w-full">
                <h3 className="text-xl md:text-2xl font-extrabold text-black">
                  {mission.title}
                </h3>
                <p className="text-sm md:text-base text-gray-800 font-medium mt-1 mb-4">
                  {mission.desc}
                </p>

                {/* Bar Misi */}
                <div className="w-full max-w-md h-5 md:h-6 bg-white border border-gray-200 rounded-full relative overflow-hidden shadow-inner">
                  <div
                    className="absolute top-0 left-0 h-full bg-[#00D166] transition-all duration-1000"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center text-xs md:text-sm font-bold text-black mix-blend-difference drop-shadow-md tracking-wider">
                    {mission.status === "claim"
                      ? "done"
                      : `${mission.progress}/${mission.maxProgress}`}
                  </div>
                </div>
              </div>

              {/* Tengah: Garis Pembatas & Hadiah */}
              <div className="flex items-center gap-4 md:gap-8 w-full md:w-auto border-t md:border-t-0 md:border-l-2 border-[#D4CFF9] pt-6 md:pt-0 md:pl-8 shrink-0">
                <div className="w-16 h-16 rounded-full bg-white shadow-sm overflow-hidden border-2 border-white">
                  <img
                    src={mission.badgeImg}
                    alt="Badge"
                    className="w-full h-full object-cover"
                    onError={(e) =>
                      (e.target.src = `https://ui-avatars.com/api/?name=Lencana&background=A898FF&color=fff`)
                    }
                  />
                </div>

                <div className="flex flex-col items-center">
                  <IconSmallMedal />
                  <span className="font-extrabold text-sm md:text-base text-black mt-1">
                    +{mission.rewardPoints}
                  </span>
                </div>
              </div>

              {/* Kanan: Tombol Aksi */}
              <div className="shrink-0 w-full md:w-auto mt-2 md:mt-0 flex justify-end">
                {mission.status === "claim" ? (
                  <button className="w-full md:w-auto bg-[#00D166] text-white px-8 md:px-10 py-3 rounded-xl font-bold text-sm md:text-base hover:bg-green-500 hover:scale-105 transition shadow-md">
                    Ambil
                  </button>
                ) : (
                  <button className="w-full md:w-auto bg-[#C0B4FE] text-gray-900 px-8 md:px-10 py-3 rounded-xl font-bold text-sm md:text-base hover:bg-purple-300 hover:scale-105 transition shadow-sm">
                    Mulai
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileMission;
