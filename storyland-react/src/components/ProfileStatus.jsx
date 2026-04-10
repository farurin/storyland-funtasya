import React, { useState, useEffect } from "react";
import ProfileCharacterSelect from "./ProfileCharacterSelect";
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

// Data Cadangan jika API belum siap
const fallbackCharacters = [
  {
    id: 1,
    name: "Student",
    image: "/images/character/character-student.png",
    isUnlocked: true,
    isActive: true,
  },
];

const ProfileStatus = () => {
  const { token } = useAuth();

  const [isEditingCharacter, setIsEditingCharacter] = useState(false);
  const [characterList, setCharacterList] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [tempCharacter, setTempCharacter] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const streakDays = [
    { day: "Min", date: 10, isActive: true, isToday: true },
    { day: "Sen", date: 11, isActive: true, isToday: false },
    { day: "Sel", date: 12, isActive: true, isToday: false },
    { day: "Rab", date: 13, isActive: false, isToday: false },
    { day: "Kam", date: 14, isActive: false, isToday: false },
    { day: "Jum", date: 15, isActive: false, isToday: false },
    { day: "Sab", date: 16, isActive: false, isToday: false },
  ];

  useEffect(() => {
    // Abaikan jika token belum di-load oleh AuthContext
    if (token === undefined) return;

    const fetchCharacters = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/user/characters",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setCharacterList(data);
            const activeChar = data.find((c) => c.isActive) || data[0];
            setSelectedCharacter(activeChar);
            setTempCharacter(activeChar);
          } else {
            throw new Error("Data kosong");
          }
        } else {
          throw new Error("Gagal mengambil data");
        }
      } catch (error) {
        console.error("Error fetching characters:", error);
        // fallback
        setCharacterList(fallbackCharacters);
        setSelectedCharacter(fallbackCharacters[0]);
        setTempCharacter(fallbackCharacters[0]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharacters();
  }, [token]);

  const handleButtonClick = async () => {
    if (isEditingCharacter) {
      try {
        const response = await fetch(
          "http://localhost:5000/api/user/characters/active",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ characterId: tempCharacter.id }),
          },
        );

        if (response.ok) {
          setSelectedCharacter(tempCharacter);
          setIsEditingCharacter(false);
        } else {
          alert("Gagal menyimpan karakter. Pastikan koneksi aman!");
        }
      } catch (error) {
        console.error("Error saving character:", error);
      }
    } else {
      setTempCharacter(selectedCharacter);
      setIsEditingCharacter(true);
    }
  };

  // Loading Screen
  if (isLoading || !selectedCharacter) {
    return (
      <div className="flex flex-col items-center justify-center py-20 w-full h-full min-h-100">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-purple-600 font-bold animate-pulse">
          Memuat Karakter...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-stretch justify-center h-full">
      <div className="flex flex-col items-center shrink-0 justify-center">
        <div className="w-64 h-64 md:w-80 md:h-80 relative mb-6">
          <img
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

        <button
          onClick={handleButtonClick}
          className="bg-[#8B5CF6] text-white font-bold py-2.5 px-12 rounded-full hover:bg-purple-700 hover:scale-105 transition shadow-lg min-w-40"
        >
          {isEditingCharacter ? "Simpan" : "Ubah"}
        </button>
      </div>

      <div className="flex-1 max-w-xl w-full flex">
        {isEditingCharacter ? (
          <ProfileCharacterSelect
            characterList={characterList}
            tempCharacter={tempCharacter}
            setTempCharacter={setTempCharacter}
          />
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default ProfileStatus;
