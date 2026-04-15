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
        <button
          onClick={handleButtonClick}
          className="bg-[#8B5CF6] text-white font-bold py-2.5 px-12 rounded-full hover:bg-purple-700 hover:scale-105 transition shadow-lg min-w-40 cursor-pointer"
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
          <ProfileInfoCard />
        )}
      </div>
    </div>
  );
};

export default ProfileStatus;
