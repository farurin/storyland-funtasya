import React, { useState, useEffect } from "react";
import {
  HiOutlinePencilAlt,
  HiLockClosed,
  HiCamera,
  HiEye,
  HiEyeOff,
} from "react-icons/hi";
import { useAuth } from "../../context/AuthContext";
import {
  getAdminProfile,
  updateAdminProfile,
  updateAdminPassword,
} from "../../services/api";
import { getImageUrl } from "../../utils/getImageUrl";
import { useAdminToast } from "../../context/AdminToastContext"; // 1. IMPORT TOAST

const AdminProfileSettings = () => {
  const { token } = useAuth();
  const { showSuccess, showError, showLoading } = useAdminToast(); // 2. PANGGIL TOAST

  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(true);

  // STATE PROFILE
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(
    "https://via.placeholder.com/150?text=No+Image",
  );
  const [existingAvatar, setExistingAvatar] = useState(null);

  // STATE PASSWORD
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [showPwd, setShowPwd] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // FETCH DATA SAAT HALAMAN DIMUAT
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getAdminProfile(token);
        setProfileData({
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          email: data.email || "",
          phone: data.phone_number || "",
          gender: data.gender || "",
        });

        if (data.avatar_url) {
          setExistingAvatar(data.avatar_url);
          setAvatarPreview(getImageUrl(data.avatar_url));
        }
      } catch (err) {
        showError("Gagal memuat profil: " + err.message); // TOAST ERROR
      } finally {
        setIsLoading(false);
      }
    };
    if (token) fetchProfile();
  }, [token, showError]);

  // HANDLERS
  const handleProfileChange = (e) =>
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) =>
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  const togglePwdVisibility = (field) =>
    setShowPwd({ ...showPwd, [field]: !showPwd[field] });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // SUBMIT UPDATE PROFILE
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    showLoading(true); // GLOBAL LOADING
    const formData = new FormData();
    formData.append("firstName", profileData.firstName);
    formData.append("lastName", profileData.lastName);
    formData.append("email", profileData.email);
    formData.append("phone", profileData.phone);
    formData.append("gender", profileData.gender);
    formData.append("existing_avatar", existingAvatar || "");

    if (avatarFile) formData.append("avatar", avatarFile);

    try {
      const res = await updateAdminProfile(formData, token);
      showSuccess(res.message || "Profil berhasil diperbarui!"); // TOAST SUKSES
      if (res.avatar_url) setExistingAvatar(res.avatar_url);
    } catch (err) {
      showError("Gagal update profil: " + err.message); // TOAST ERROR
    } finally {
      showLoading(false); // MATIKAN LOADING
    }
  };

  // SUBMIT UPDATE PASSWORD
  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) {
      return showError("Password baru dan konfirmasi tidak cocok!"); // TOAST ERROR
    }

    showLoading(true); // GLOBAL LOADING
    try {
      const payload = {
        currentPassword: passwordData.current,
        newPassword: passwordData.new,
      };
      const res = await updateAdminPassword(payload, token);
      showSuccess(res.message || "Password berhasil diubah!"); // TOAST SUKSES
      setPasswordData({ current: "", new: "", confirm: "" });
    } catch (err) {
      showError(err.message); // TOAST ERROR
    } finally {
      showLoading(false); // MATIKAN LOADING
    }
  };

  if (isLoading)
    return (
      <div className="p-12 text-center text-gray-500 font-bold">
        Memuat Profil...
      </div>
    );

  return (
    <div className="p-8 md:p-12 w-full min-h-screen bg-gray-50 flex justify-center items-start">
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8 md:gap-12">
        {/* MENU TABS */}
        <div className="w-full md:w-72 shrink-0">
          <h1 className="text-3xl font-black text-gray-900 mb-8">
            Profile Setting
          </h1>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-4 px-6 py-5 text-sm font-bold transition-colors cursor-pointer ${activeTab === "profile" ? "bg-[#FEF0A5] text-amber-800 border-l-4 border-[#F8AF2F]" : "text-gray-500 hover:bg-gray-50 border-l-4 border-transparent"}`}
            >
              <HiOutlinePencilAlt className="text-xl" /> Edit Profile
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`w-full flex items-center gap-4 px-6 py-5 text-sm font-bold transition-colors cursor-pointer ${activeTab === "password" ? "bg-[#FEF0A5] text-amber-800 border-l-4 border-[#F8AF2F]" : "text-gray-500 hover:bg-gray-50 border-l-4 border-transparent"}`}
            >
              <HiLockClosed className="text-xl" /> Password
            </button>
          </div>
        </div>

        {/* KONTEN */}
        <div className="flex-1 w-full bg-white rounded-4xl p-8 md:p-12 shadow-sm border border-gray-100">
          <div className="flex items-center gap-6 mb-10">
            <div className="relative inline-block">
              <img
                src={avatarPreview}
                alt="Profile Avatar"
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md bg-gray-100"
              />
              <label className="absolute bottom-0 right-0 bg-[#F8AF2F] p-2.5 rounded-full text-white cursor-pointer shadow-lg hover:scale-105 transition-transform border-2 border-white">
                <HiCamera className="text-lg" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
          </div>

          {activeTab === "profile" && (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Nama Depan
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleProfileChange}
                    className="w-full bg-transparent border border-gray-300 focus:border-[#F8AF2F] rounded-xl px-5 py-3.5 text-sm font-medium outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Nama Belakang
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleProfileChange}
                    className="w-full bg-transparent border border-gray-300 focus:border-[#F8AF2F] rounded-xl px-5 py-3.5 text-sm font-medium outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    className="w-full bg-transparent border border-gray-300 focus:border-[#F8AF2F] rounded-xl px-5 py-3.5 text-sm font-medium outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Nomor Telepon
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                    className="w-full bg-transparent border border-gray-300 focus:border-[#F8AF2F] rounded-xl px-5 py-3.5 text-sm font-medium outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  Gender
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      setProfileData({ ...profileData, gender: "Laki-laki" })
                    }
                    className={`px-8 py-3 rounded-xl text-sm font-bold border transition-colors cursor-pointer ${profileData.gender === "Laki-laki" ? "bg-[#F8AF2F] text-white border-[#F8AF2F] shadow-sm" : "bg-transparent text-gray-500 border-gray-300"}`}
                  >
                    Laki-laki
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setProfileData({ ...profileData, gender: "Perempuan" })
                    }
                    className={`px-8 py-3 rounded-xl text-sm font-bold border transition-colors cursor-pointer ${profileData.gender === "Perempuan" ? "bg-[#F8AF2F] text-white border-[#F8AF2F] shadow-sm" : "bg-transparent text-gray-500 border-gray-300"}`}
                  >
                    Perempuan
                  </button>
                </div>
              </div>

              <div className="pt-8">
                <button
                  type="submit"
                  className="bg-[#F8AF2F] hover:bg-yellow-500 text-white font-bold px-8 py-3.5 rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          )}

          {activeTab === "password" && (
            <form onSubmit={handleSavePassword} className="space-y-6 max-w-lg">
              {["current", "new", "confirm"].map((field, idx) => (
                <div key={idx}>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    {field === "current"
                      ? "Password saat ini"
                      : field === "new"
                        ? "Password Baru"
                        : "Konfirmasi Password"}
                  </label>
                  <div className="relative">
                    <input
                      type={showPwd[field] ? "text" : "password"}
                      name={field}
                      value={passwordData[field]}
                      onChange={handlePasswordChange}
                      className="w-full bg-transparent border border-gray-300 focus:border-[#F8AF2F] rounded-xl px-5 py-3.5 pr-12 text-sm font-medium outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePwdVisibility(field)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showPwd[field] ? (
                        <HiEyeOff className="text-xl" />
                      ) : (
                        <HiEye className="text-xl" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
              <div className="pt-8">
                <button
                  type="submit"
                  className="bg-[#F8AF2F] hover:bg-yellow-500 text-white font-bold px-8 py-3.5 rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfileSettings;
