import React, { useState } from "react";

// --- IKON GEMBOK ---
const IconLock = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="black"
  >
    <path d="M19 11h-1.5V7.5C17.5 4.46 15.04 2 12 2S6.5 4.46 6.5 7.5V11H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2zM9.5 7.5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5V11h-5V7.5zm2.5 9.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
  </svg>
);

const ProfileCharacterSelect = ({
  characterList,
  tempCharacter,
  setTempCharacter,
}) => {
  const [filter, setFilter] = useState("Semua");

  const filteredList = characterList.filter((char) => {
    if (filter === "Semua") return true;
    if (filter === "Unlocked") return char.isUnlocked;
    if (filter === "Locked") return !char.isUnlocked;
    return true;
  });

  return (
    <div className="w-full max-w-xl bg-[#F4F3FF] rounded-[40px] p-6 md:p-8 shadow-sm border border-white/50 animate-fade-in relative flex flex-col h-full min-h-100">
      {/* Header Kotak Kanan */}
      <div className="flex justify-between items-center mb-4 md:mb-6 shrink-0">
        <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">
          Pilih Karakter
        </h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-white border border-purple-200 text-gray-600 text-xs md:text-sm rounded-full focus:ring-purple-500 focus:border-purple-500 block px-3 md:px-4 py-1.5 shadow-sm outline-none cursor-pointer"
        >
          <option value="Semua">Semua</option>
          <option value="Unlocked">Unlocked</option>
          <option value="Locked">Locked</option>
        </select>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar -m-2 p-2">
        <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 content-start pb-2">
          {filteredList.map((char) => (
            <button
              key={char.id}
              onClick={() => {
                if (char.isUnlocked) setTempCharacter(char);
              }}
              className={`relative flex flex-col items-center p-3 rounded-2xl border-2 transition-all duration-200 h-30 md:h-32.5 justify-between ${
                tempCharacter.id === char.id
                  ? "border-[#8B5CF6] bg-purple-50 shadow-md scale-105 z-10"
                  : "border-transparent bg-white hover:bg-gray-50 shadow-sm z-0"
              } ${!char.isUnlocked ? "cursor-not-allowed" : "cursor-pointer"}`}
            >
              <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 mt-1">
                <img
                  src={char.image}
                  alt={char.name}
                  className={`w-full h-full object-contain ${!char.isUnlocked ? "grayscale opacity-50" : ""}`}
                />
              </div>

              {char.isUnlocked ? (
                <span className="text-[10px] md:text-xs font-bold text-gray-900 mt-2">
                  {char.name}
                </span>
              ) : (
                <div className="w-full bg-[#8B5CF6] text-white text-[10px] md:text-xs font-bold py-1 rounded-md mt-2 leading-none flex items-center justify-center h-5 md:h-6">
                  Locked
                </div>
              )}

              {!char.isUnlocked && (
                <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-70">
                  <IconLock />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* CSS Scrollbar */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #C4B5FD; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default ProfileCharacterSelect;
