import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CtaDownload from "../components/CtaDownload";
import ProfileStatus from "../components/ProfileStatus";
import ProfileAchievement from "../components/ProfileAchievement";
import ProfileLeaderboard from "../components/ProfileLeaderboard";
import ProfileMission from "../components/ProfileMission";
import ActionPopupModal from "../components/ActionPopupModal";

const Profile = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [activeTab, setActiveTab] = useState("Status");
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const tabs = ["Status", "Pencapaian", "Papan Ranking", "Misi"];

  // Fungsi saat klik "Keluar" di popup
  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    navigate("/");
    setTimeout(() => {
      logout();
    }, 100);
  };

  return (
    <div className="w-full relative">
      <div className="max-w-6xl mx-auto px-6 pt-12 pb-10 min-h-[60vh]">
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

          {/* ProfileLeaderboard */}
          {activeTab === "Papan Ranking" && <ProfileLeaderboard />}

          {/* ProfileMission */}
          {activeTab === "Misi" && <ProfileMission />}
        </div>

        {/* TOMBOL LOGOUT UTAMA (Merah) */}
        <div className="flex justify-center mt-16 mb-4">
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="bg-[#CF2400] text-white font-extrabold py-3 px-14 rounded-full hover:bg-red-700 hover:scale-105 transition-all shadow-md cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>

      <CtaDownload />

      {/* POPUP KONFIRMASI LOGOUT */}
      <ActionPopupModal
        isOpen={isLogoutModalOpen}
        image="/images/popups/popup-delete-fav.png"
        title="Apakah kamu yakin ingin keluar?"
        description="Kamu bisa masuk lagi kapan saja"
        primaryBtnText="Keluar"
        primaryBtnColor="bg-[#8B5CF6] hover:bg-purple-700"
        secondaryBtnText="Tutup"
        onPrimaryClick={handleConfirmLogout}
        onSecondaryClick={() => setIsLogoutModalOpen(false)}
      />
    </div>
  );
};

export default Profile;
