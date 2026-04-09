import React, { useState } from "react";
import CtaDownload from "../components/CtaDownload";
import ProfileStatus from "../components/ProfileStatus";
import ProfileAchievement from "../components/ProfileAchievement";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("Status");
  const tabs = ["Status", "Pencapaian", "Papan Ranking", "Misi"];

  return (
    <div className="w-full">
      <div className="max-w-6xl mx-auto px-6 pt-12 pb-20 min-h-[60vh]">
        {/* JUDUL */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 mb-8">
          Profile
        </h1>

        {/* TAB MENU */}
        <div className="flex justify-center mb-12 md:mb-16">
          <div className="bg-[#6B4EFF] flex items-center p-1.5 rounded-full overflow-x-auto max-w-full shadow-md">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 md:px-8 py-2.5 rounded-full font-bold text-sm md:text-base whitespace-nowrap transition-all ${
                  activeTab === tab
                    ? "bg-white text-[#6B4EFF] shadow-sm"
                    : "text-white hover:bg-white/10"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* RENDER KONTEN BERDASARKAN TAB AKTIF */}
        <div className="transition-all duration-300">
          {/* ProfileStatus */}
          {activeTab === "Status" && <ProfileStatus />}

          {/* ProfileAchievement */}
          {activeTab === "Pencapaian" && <ProfileAchievement />}

          {activeTab === "Papan Ranking" && (
            <div className="text-center text-gray-500 py-20 font-bold">
              Halaman Papan Ranking Segera Hadir!
            </div>
          )}
          {activeTab === "Misi" && (
            <div className="text-center text-gray-500 py-20 font-bold">
              Halaman Misi Segera Hadir!
            </div>
          )}
        </div>
      </div>

      <CtaDownload />
    </div>
  );
};

export default Profile;
