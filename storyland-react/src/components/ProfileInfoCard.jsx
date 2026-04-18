import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserProfile, getAvatars, updateUserProfile } from "../services/api";
import { getImageUrl } from "../utils/getImageUrl";

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
const IconClose = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const ProfileInfoCard = () => {
  const { token } = useAuth();

  const [profileData, setProfileData] = useState(null);
  const [avatarList, setAvatarList] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    username: "",
    age: "",
    avatar_url: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!token) return;
    try {
      const data = await getUserProfile(token);
      setProfileData(data);
    } catch (err) {
      console.error("Gagal ambil profil:", err);
    }
  }, [token]);

  const fetchAvatarData = useCallback(async () => {
    if (!token) return;
    try {
      const data = await getAvatars(token);
      setAvatarList(data);
    } catch (err) {
      console.error("Gagal ambil daftar avatar:", err);
    }
  }, [token]);

  useEffect(() => {
    fetchProfile();
    fetchAvatarData();
  }, [fetchProfile, fetchAvatarData]);

  const handleOpenModal = () => {
    setEditData({
      username: profileData.username,
      age: profileData.age || "",
      avatar_url:
        profileData.avatar_url ||
        (avatarList.length > 0 ? avatarList[0].image_url : ""),
    });
    setIsModalOpen(true);
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await updateUserProfile(
        {
          username: editData.username,
          age: parseInt(editData.age) || 0,
          avatar_url: editData.avatar_url,
        },
        token,
      );

      await fetchProfile();
      setIsModalOpen(false);
    } catch (err) {
      alert(err.message || "Gagal menyimpan profil.");
      console.error("Error saving profile:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!profileData) {
    return (
      <div className="w-full bg-[#F4F3FF] rounded-[40px] p-8 flex flex-col justify-center items-center min-h-100 border border-white/50 shadow-sm">
        <div className="w-10 h-10 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-purple-600 font-bold animate-pulse">
          Memuat Data Status...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#F4F3FF] rounded-3xl md:rounded-[40px] p-5 md:p-8 relative shadow-sm border border-white/50 animate-fade-in flex flex-col justify-between min-h-auto md:min-h-100">
      {/* Tombol Ubah */}
      <button
        onClick={handleOpenModal}
        className="absolute top-5 right-5 md:top-8 md:right-8 flex items-center gap-1.5 bg-white px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[10px] md:text-xs font-bold text-gray-600 border border-gray-200 hover:bg-gray-50 transition shadow-sm cursor-pointer z-10"
      >
        <IconEdit /> Ubah
      </button>

      {/* Area Avatar dan Nama */}
      <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-4 md:gap-6 mb-8 md:mb-10 mt-4 md:mt-2">
        <div className="relative">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-[#EAE8F0] rounded-full border-4 border-white overflow-hidden shadow-sm">
            <img
              // helper getImageUrl
              src={getImageUrl(profileData.avatar_url)}
              alt="Avatar"
              className="w-full h-full object-cover"
              onError={(e) =>
                (e.target.src = `https://ui-avatars.com/api/?name=${profileData.username}&background=EAE8F0&color=6B4EFF`)
              }
            />
          </div>
          {/* Badge Api di sudut Avatar */}
          <div className="absolute top-0 right-0 w-6 h-6 md:w-7 md:h-7 bg-white rounded-full flex items-center justify-center shadow-md">
            <IconFire />
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <h2 className="text-xl md:text-3xl font-extrabold text-gray-900 leading-tight truncate max-w-50 md:max-w-50 mx-auto md:mx-0">
            {profileData.username}
          </h2>
          <p className="text-xs md:text-base font-semibold text-gray-600 mt-1">
            {profileData.age > 0
              ? `${profileData.age} Tahun`
              : "Umur belum diatur"}
          </p>
        </div>
      </div>

      {/* Area Statistik (Streak, Pencapaian, Peringkat) */}
      <div className="grid grid-cols-3 md:flex md:flex-row items-center justify-between md:justify-start gap-2 md:gap-10 mb-8 md:mb-10 w-full">
        {/* Item 1: Streak */}
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 text-center md:text-left">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
            <IconFire />
          </div>
          <div>
            <h4 className="text-lg md:text-2xl font-extrabold text-gray-900 leading-none">
              {profileData.current_streak}
            </h4>
            <p className="text-[9px] md:text-xs font-bold text-gray-500 mt-0.5 md:mt-0">
              Streak Harian
            </p>
          </div>
        </div>

        {/* Item 2: Pencapaian */}
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 text-center md:text-left">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
            <IconMedal />
          </div>
          <div>
            <h4 className="text-lg md:text-2xl font-extrabold text-gray-900 leading-none">
              {profileData.total_achievements}
            </h4>
            <p className="text-[9px] md:text-xs font-bold text-gray-500 mt-0.5 md:mt-0">
              Pencapaian
            </p>
          </div>
        </div>

        {/* Item 3: Peringkat */}
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 text-center md:text-left">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
            <IconPodium />
          </div>
          <div>
            <h4 className="text-lg md:text-2xl font-extrabold text-gray-900 leading-none">
              {profileData.rank}
            </h4>
            <p className="text-[9px] md:text-xs font-bold text-gray-500 mt-0.5 md:mt-0">
              Peringkat
            </p>
          </div>
        </div>
      </div>

      {/* Area Kalender */}
      <div className="w-full bg-white/40 p-2 md:p-3 rounded-2xl md:rounded-3xl overflow-x-auto scrollbar-hide">
        <div className="flex justify-between items-center min-w-70">
          {profileData.calendar &&
            profileData.calendar.map((item, index) => (
              <div
                key={index}
                className={`flex flex-col items-center justify-center w-10 md:w-14 h-16 md:h-20 rounded-xl md:rounded-2xl transition-all shrink-0 ${
                  item.isActive ? "bg-[#DFDAFE] shadow-sm" : "bg-transparent"
                }`}
              >
                <div className="h-2 mb-1">
                  {item.isToday && (
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-black rounded-full"></div>
                  )}
                </div>
                <span className="text-[10px] md:text-xs font-bold text-gray-600 mb-0.5 md:mb-1">
                  {item.day}
                </span>
                <span className="text-sm md:text-lg font-extrabold text-gray-900">
                  {item.date}
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* MODAL UBAH PROFIL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-120 flex items-center justify-center p-4 bg-black/40 animate-fade-in">
          <div className="bg-white rounded-4xl md:rounded-4xl w-full max-w-2xl p-5 md:p-10 relative shadow-2xl scale-100 transition-transform max-h-[90vh] overflow-y-auto scrollbar-hide">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 md:top-8 md:right-8 text-black hover:scale-110 transition cursor-pointer bg-gray-100 rounded-full p-1 md:bg-transparent md:p-0"
            >
              <IconClose />
            </button>

            <h2 className="text-2xl md:text-3xl font-extrabold text-center text-gray-900 mb-6 md:mb-8 mt-2">
              Ubah Profile
            </h2>

            <div className="space-y-4 mb-6 md:mb-8">
              <div className="bg-[#F4F3FF] rounded-2xl md:rounded-[20px] px-4 py-2 md:px-5 md:py-3 border border-transparent focus-within:border-[#C0B4FE] transition-colors">
                <label className="text-[10px] md:text-xs font-bold text-[#A898FF] block mb-1">
                  Nama*
                </label>
                <input
                  type="text"
                  value={editData.username}
                  onChange={(e) =>
                    setEditData({ ...editData, username: e.target.value })
                  }
                  className="w-full bg-transparent text-gray-900 text-sm md:text-base font-bold outline-none"
                  placeholder="Masukkan nama"
                />
              </div>

              <div className="bg-[#F4F3FF] rounded-2xl md:rounded-[20px] px-4 py-2 md:px-5 md:py-3 border border-transparent focus-within:border-[#C0B4FE] transition-colors">
                <label className="text-[10px] md:text-xs font-bold text-[#A898FF] block mb-1">
                  Usia*
                </label>
                <input
                  type="number"
                  value={editData.age}
                  onChange={(e) =>
                    setEditData({ ...editData, age: e.target.value })
                  }
                  className="w-full bg-transparent text-gray-900 text-sm md:text-base font-bold outline-none"
                  placeholder="Masukkan usia"
                />
              </div>
            </div>

            <div className="mb-8 md:mb-10">
              <h3 className="text-[#A898FF] font-bold text-sm md:text-base mb-3 md:mb-4 text-center md:text-left">
                Pilih karakter profile
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-4 max-h-[40vh] md:max-h-none overflow-y-auto p-1">
                {avatarList.length > 0 ? (
                  avatarList.map((avatar) => (
                    <button
                      key={avatar.id}
                      onClick={() =>
                        setEditData({
                          ...editData,
                          avatar_url: avatar.image_url,
                        })
                      }
                      className={`aspect-square rounded-full overflow-hidden transition-all duration-300 cursor-pointer ${
                        editData.avatar_url === avatar.image_url
                          ? "border-4 border-[#A898FF] scale-110 shadow-md"
                          : "border-2 border-transparent hover:scale-105"
                      }`}
                    >
                      <img
                        // helper untuk daftar pilihan avatar
                        src={getImageUrl(avatar.image_url)}
                        alt={avatar.name}
                        className="w-full h-full object-cover bg-[#EAE8F0]"
                        onError={(e) =>
                          (e.target.src = `https://ui-avatars.com/api/?name=${avatar.name}&background=EAE8F0&color=6B4EFF`)
                        }
                      />
                    </button>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 col-span-full text-center md:text-left">
                    Belum ada pilihan avatar.
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="bg-[#EAE8F0] text-[#A898FF] hover:bg-[#6B4EFF] hover:text-white w-full md:w-auto px-10 py-3 rounded-xl md:rounded-2xl font-extrabold transition-colors disabled:opacity-50 cursor-pointer text-sm md:text-base"
              >
                {isSaving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileInfoCard;
