import React, { useState } from "react";
import ProfileCharacterSelect from "./ProfileCharacterSelect"; // Import komponen baru

// --- IKON SVG ---
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

// --- DAFTAR KARAKTER ---
const characterList = [
  {
    id: "astronaut",
    name: "Astronaut",
    image: "/images/character/character-astronaut.png",
    isUnlocked: true,
  },
  {
    id: "professor",
    name: "Professor",
    image: "/images/character/character-professor.png",
    isUnlocked: true,
  },
  {
    id: "gamer",
    name: "Gamer",
    image: "/images/character/character-gamer.png",
    isUnlocked: true,
  },
  {
    id: "chef",
    name: "Chef",
    image: "/images/character/character-chef.png",
    isUnlocked: true,
  },
  {
    id: "student",
    name: "Student",
    image: "/images/character/character-student.png",
    isUnlocked: true,
  },
  {
    id: "detective",
    name: "Detective",
    image: "/images/character/character-detective.png",
    isUnlocked: true,
  },
  {
    id: "king",
    name: "King",
    image: "/images/character/character-king.png",
    isUnlocked: true,
  },
  {
    id: "musician",
    name: "Locked",
    image: "/images/character/character-mucisian.png",
    isUnlocked: false,
  },
];

const ProfileStatus = () => {
  // STATE KONTROL TAMPILAN
  const [isEditingCharacter, setIsEditingCharacter] = useState(false);

  // STATE KARAKTER
  const [selectedCharacter, setSelectedCharacter] = useState(
    characterList.find((c) => c.id === "student"),
  );
  const [tempCharacter, setTempCharacter] = useState(selectedCharacter);

  const streakDays = [
    { day: "Min", date: 10, isActive: true, isToday: true },
    { day: "Sen", date: 11, isActive: true, isToday: false },
    { day: "Sel", date: 12, isActive: true, isToday: false },
    { day: "Rab", date: 13, isActive: false, isToday: false },
    { day: "Kam", date: 14, isActive: false, isToday: false },
    { day: "Jum", date: 15, isActive: false, isToday: false },
    { day: "Sab", date: 16, isActive: false, isToday: false },
  ];

  // Fungsi saat tombol Ubah/Simpan diklik
  const handleButtonClick = () => {
    if (isEditingCharacter) {
      // Jika sedang edit, berarti tombol ini bertindak sebagai "Simpan"
      setSelectedCharacter(tempCharacter);
      setIsEditingCharacter(false);
    } else {
      // Jika tidak sedang edit, berarti tombol ini bertindak sebagai "Ubah"
      setTempCharacter(selectedCharacter); // Samakan state sementara dengan yang aktif
      setIsEditingCharacter(true);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-stretch justify-center h-full">
      {/* kiri: ilustrasi & tombol ubah/simpan */}
      <div className="flex flex-col items-center shrink-0 justify-center">
        <div className="w-64 h-64 md:w-80 md:h-80 relative mb-6">
          <img
            // Jika sedang edit, tampilkan yang sementara dipilih. Jika tidak, tampilkan yang sudah disave.
            src={
              isEditingCharacter ? tempCharacter.image : selectedCharacter.image
            }
            alt="Maskot Profil"
            className={`w-full h-full object-contain drop-shadow-md transition-all duration-300 ${isEditingCharacter && !tempCharacter.isUnlocked ? "grayscale opacity-50" : ""}`}
            onError={(e) =>
              (e.target.src = "https://via.placeholder.com/300x300?text=Maskot")
            }
          />
        </div>

        {/* Tombol Berubah Teks Sesuai State */}
        <button
          onClick={handleButtonClick}
          className="bg-[#8B5CF6] text-white font-bold py-2.5 px-12 rounded-full hover:bg-purple-700 hover:scale-105 transition shadow-lg min-w-40"
        >
          {isEditingCharacter ? "Simpan" : "Ubah"}
        </button>
      </div>

      {/* kanan: kartu status atau pilih karakter */}
      <div className="flex-1 max-w-xl w-full flex">
        {isEditingCharacter ? (
          // show komponen pilih karakter
          <ProfileCharacterSelect
            characterList={characterList}
            tempCharacter={tempCharacter}
            setTempCharacter={setTempCharacter}
          />
        ) : (
          // show kartu status
          <div className="w-full bg-[#F4F3FF] rounded-[40px] p-6 md:p-8 relative shadow-sm border border-white/50 animate-fade-in flex flex-col justify-between">
            <button
              onClick={() => setIsEditingCharacter(true)}
              className="absolute top-6 right-6 md:top-8 md:right-8 flex items-center gap-1.5 bg-white px-4 py-1.5 rounded-full text-xs font-bold text-gray-600 border border-gray-200 hover:bg-gray-50 transition shadow-sm"
            >
              <IconEdit /> Ubah
            </button>

            <div className="flex items-center gap-5 md:gap-6 mb-10">
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
                <div className="absolute top-0 right-0 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md">
                  <IconFire />
                </div>
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
                  Budi
                </h2>
                <p className="text-sm md:text-base font-semibold text-gray-600 mt-1">
                  10 Tahun
                </p>
              </div>
            </div>

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

            <div className="flex justify-between items-center bg-white/40 p-2 rounded-3xl">
              {streakDays.map((item, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center justify-center w-10 md:w-14 h-16 md:h-20 rounded-2xl transition-all ${
                    item.isActive ? "bg-[#DFDAFE] shadow-sm" : "bg-transparent"
                  }`}
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
        )}
      </div>
    </div>
  );
};

export default ProfileStatus;
