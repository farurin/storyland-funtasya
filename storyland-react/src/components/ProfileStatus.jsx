import React, { useState, useEffect } from "react";
import ProfileCharacterSelect from "./ProfileCharacterSelect";
import ProfileInfoCard from "./ProfileInfoCard";
import { useAuth } from "../context/AuthContext";
import { getCharacters, updateActiveCharacter } from "../services/api";

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

  // Variabel untuk mengontrol status tombol (TRUE = tombol mati/tidak bisa diklik)
  const isFeatureDisabled = true;

  useEffect(() => {
    if (token === undefined) return;

    const fetchCharacterData = async () => {
      try {
        const data = await getCharacters(token);
        if (data && data.length > 0) {
          setCharacterList(data);
          const activeChar = data.find((c) => c.isActive) || data[0];
          setSelectedCharacter(activeChar);
          setTempCharacter(activeChar);
        } else {
          throw new Error("Data kosong");
        }
      } catch (error) {
        console.error("Error fetching characters:", error);
        setCharacterList(fallbackCharacters);
        setSelectedCharacter(fallbackCharacters[0]);
        setTempCharacter(fallbackCharacters[0]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharacterData();
  }, [token]);

  const handleButtonClick = async () => {
    // Tambahan perlindungan jika tombol dipaksa klik
    if (isFeatureDisabled) return;

    if (isEditingCharacter) {
      try {
        await updateActiveCharacter(tempCharacter.id, token);
        setSelectedCharacter(tempCharacter);
        setIsEditingCharacter(false);
      } catch (error) {
        alert(
          error.message || "Gagal menyimpan karakter. Pastikan koneksi aman!",
        );
        console.error("Error saving character:", error);
      }
    } else {
      setTempCharacter(selectedCharacter);
      setIsEditingCharacter(true);
    }
  };

  if (isLoading || !selectedCharacter) {
    return (
      <div className="flex flex-col items-center justify-center py-20 w-full h-full min-h-75">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-purple-600 font-bold animate-pulse text-sm md:text-base">
          Memuat Karakter...
        </p>
      </div>
    );
  }

  return (
    // PERBAIKAN RESPONSIVITAS:
    // Di HP bertumpuk (flex-col), di Tablet/Desktop bersebelahan (lg:flex-row)
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-20 items-center lg:items-stretch justify-center h-full w-full">
      {/* Kolom Kiri: Karakter & Tombol Ubah */}
      <div className="flex flex-col items-center shrink-0 justify-center w-full lg:w-auto">
        <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-80 lg:h-80 relative mb-4 md:mb-6">
          <img
            src={
              isEditingCharacter ? tempCharacter.image : selectedCharacter.image
            }
            alt="Maskot Profil"
            className={`w-full h-full object-contain drop-shadow-md transition-all duration-300 ${
              isEditingCharacter && !tempCharacter.isUnlocked
                ? "grayscale opacity-50"
                : ""
            }`}
            onError={(e) =>
              (e.target.src = "https://via.placeholder.com/300x300?text=Maskot")
            }
          />
        </div>

        {/* PERBAIKAN TOMBOL: Menonaktifkan tombol sementara */}
        <button
          onClick={handleButtonClick}
          disabled={isFeatureDisabled} // Menerapkan status disabled
          className={`font-bold py-2.5 px-12 rounded-full min-w-40 md:min-w-45 text-sm md:text-base transition-all shadow-md
            ${
              isFeatureDisabled
                ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none" // Gaya saat tombol mati
                : "bg-[#8B5CF6] text-white hover:bg-purple-700 hover:scale-105 cursor-pointer shadow-lg" // Gaya saat tombol nyala
            }
          `}
        >
          {/* fitur belum fix */}
          {isFeatureDisabled
            ? "Segera Hadir"
            : isEditingCharacter
              ? "Simpan"
              : "Ubah"}
        </button>
      </div>

      {/* Kolom Kanan: Info Card atau Pilihan Karakter */}
      <div className="flex-1 w-full max-w-xl flex justify-center lg:justify-start mt-6 lg:mt-0">
        {isEditingCharacter && !isFeatureDisabled ? (
          <ProfileCharacterSelect
            characterList={characterList}
            tempCharacter={tempCharacter}
            setTempCharacter={setTempCharacter}
          />
        ) : (
          <ProfileInfoCard />
        )}
      </div>
    </div>
  );
};

export default ProfileStatus;
