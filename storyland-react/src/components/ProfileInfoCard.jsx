import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserProfile, getAvatars, updateUserProfile } from "../services/api";

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
    <div className="w-full bg-[#F4F3FF] rounded-[40px] p-6 md:p-8 relative shadow-sm border border-white/50 animate-fade-in flex flex-col justify-between min-h-100">
      <button
        onClick={handleOpenModal}
        className="absolute top-6 right-6 md:top-8 md:right-8 flex items-center gap-1.5 bg-white px-4 py-1.5 rounded-full text-xs font-bold text-gray-600 border border-gray-200 hover:bg-gray-50 transition shadow-sm cursor-pointer"
      >
        <IconEdit /> Ubah
      </button>

      <div className="flex items-center gap-5 md:gap-6 mb-10 mt-2">
        <div className="relative">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-[#EAE8F0] rounded-full border-4 border-white overflow-hidden shadow-sm">
            <img
              src={profileData.avatar_url || "/images/avatars/cat-avatar.png"}
              alt="Avatar"
              className="w-full h-full object-cover"
              onError={(e) =>
                (e.target.src = `https://ui-avatars.com/api/?name=${profileData.username}&background=EAE8F0&color=6B4EFF`)
              }
            />
          </div>
          <div className="absolute top-0 right-0 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md">
            <IconFire />
          </div>
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight truncate max-w-50">
            {profileData.username}
          </h2>
          <p className="text-sm md:text-base font-semibold text-gray-600 mt-1">
            {profileData.age > 0
              ? `${profileData.age} Tahun`
              : "Umur belum diatur"}
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
              {profileData.current_streak}
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
              {profileData.total_achievements}
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
              {profileData.rank}
            </h4>
            <p className="text-[10px] md:text-xs font-bold text-gray-500">
              Peringkat
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center bg-white/40 p-2 rounded-3xl">
        {profileData.calendar &&
          profileData.calendar.map((item, index) => (
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

      {isModalOpen && (
        <div className="fixed inset-0 z-120 flex items-center justify-center p-4 bg-black/40 animate-fade-in">
          <div className="bg-white rounded-4xl w-full max-w-2xl p-6 md:p-10 relative shadow-2xl scale-100 transition-transform">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 md:top-8 md:right-8 text-black hover:scale-110 transition cursor-pointer"
            >
              <IconClose />
            </button>

            <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8 mt-2">
              Ubah Profile
            </h2>

            <div className="space-y-4 mb-8">
              <div className="bg-[#F4F3FF] rounded-[20px] px-5 py-3 border border-transparent focus-within:border-[#C0B4FE] transition-colors">
                <label className="text-xs font-bold text-[#A898FF] block mb-1">
                  Nama*
                </label>
                <input
                  type="text"
                  value={editData.username}
                  onChange={(e) =>
                    setEditData({ ...editData, username: e.target.value })
                  }
                  className="w-full bg-transparent text-gray-900 font-bold outline-none"
                  placeholder="Masukkan nama"
                />
              </div>

              <div className="bg-[#F4F3FF] rounded-[20px] px-5 py-3 border border-transparent focus-within:border-[#C0B4FE] transition-colors">
                <label className="text-xs font-bold text-[#A898FF] block mb-1">
                  Usia*
                </label>
                <input
                  type="number"
                  value={editData.age}
                  onChange={(e) =>
                    setEditData({ ...editData, age: e.target.value })
                  }
                  className="w-full bg-transparent text-gray-900 font-bold outline-none"
                  placeholder="Masukkan usia"
                />
              </div>
            </div>

            <div className="mb-10">
              <h3 className="text-[#A898FF] font-bold mb-4">
                Pilih karakter profile
              </h3>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
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
                        src={avatar.image_url}
                        alt={avatar.name}
                        className="w-full h-full object-cover bg-[#EAE8F0]"
                        onError={(e) =>
                          (e.target.src = `https://ui-avatars.com/api/?name=${avatar.name}&background=EAE8F0&color=6B4EFF`)
                        }
                      />
                    </button>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 col-span-full">
                    Belum ada pilihan avatar.
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="bg-[#EAE8F0] text-[#A898FF] hover:bg-[#6B4EFF] hover:text-white px-10 py-3 rounded-2xl font-extrabold transition-colors disabled:opacity-50 cursor-pointer"
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
