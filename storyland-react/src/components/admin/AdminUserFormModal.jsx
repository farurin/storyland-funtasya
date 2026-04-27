import React, { useState, useEffect } from "react";
import { HiX, HiEye, HiEyeOff } from "react-icons/hi";
import { createAdminUser, updateAdminUser } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useAdminToast } from "../../context/AdminToastContext";

const IconAddUser = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <line x1="20" y1="8" x2="20" y2="14" />
    <line x1="23" y1="11" x2="17" y2="11" />
  </svg>
);

const AdminUserFormModal = ({ isOpen, onClose, onSuccess, userToEdit }) => {
  const { token } = useAuth();
  const { showSuccess, showError, showLoading } = useAdminToast();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    password: "",
  });

  const isEditMode = !!userToEdit;

  // Isi data ke form saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      if (isEditMode) {
        setFormData({
          firstName: userToEdit.firstName || "",
          lastName: userToEdit.lastName || "",
          email: userToEdit.email || "",
          role: userToEdit.role || "",
          password: "", // Kosongkan password saat edit
        });
      } else {
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          role: "",
          password: "",
        });
      }
      setShowPassword(false);
    }
  }, [isOpen, userToEdit, isEditMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi
    if (!formData.firstName || !formData.email || !formData.role) {
      return showError("Nama Depan, Email, dan Role wajib diisi.");
    }
    // Jika tambah baru, password wajib
    if (!isEditMode && !formData.password) {
      return showError("Password wajib diisi untuk pengguna baru.");
    }

    showLoading(true);
    try {
      if (isEditMode) {
        await updateAdminUser(userToEdit.id, formData, token);
        showSuccess("Data pengguna berhasil diperbarui!");
      } else {
        await createAdminUser(formData, token);
        showSuccess("Pengguna baru berhasil ditambahkan!");
      }
      onSuccess(); // Pico tabelrefresh data
      onClose(); // Tutup modal
    } catch (err) {
      showError(err.message);
    } finally {
      showLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[110] p-4 animate-fade-in">
      <div className="bg-white w-full max-w-[600px] rounded-[32px] p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-gray-400 hover:text-gray-900 transition-colors cursor-pointer"
        >
          <HiX className="text-2xl" />
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-yellow-100 text-yellow-500 rounded-full flex items-center justify-center">
            <IconAddUser />
          </div>
          <h2 className="text-2xl font-black text-gray-900">
            {isEditMode ? "Edit Pengguna" : "Tambah Pengguna"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Nama Depan *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Lengkapi nama depan"
                  className="w-full border border-gray-300 focus:border-[#F8AF2F] focus:ring-1 focus:ring-[#F8AF2F] rounded-xl px-4 py-3 text-sm outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Nama Belakang
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Lengkapi nama belakang"
                  className="w-full border border-gray-300 focus:border-[#F8AF2F] focus:ring-1 focus:ring-[#F8AF2F] rounded-xl px-4 py-3 text-sm outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Role *
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full border border-gray-300 focus:border-[#F8AF2F] focus:ring-1 focus:ring-[#F8AF2F] rounded-xl px-4 py-3 text-sm outline-none text-gray-600 bg-white"
                  required
                >
                  <option value="" disabled>
                    Pilih Role Pengguna
                  </option>
                  <option value="super_admin">Super Admin</option>
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                </select>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Lengkapi Email"
                  className="w-full border border-gray-300 focus:border-[#F8AF2F] focus:ring-1 focus:ring-[#F8AF2F] rounded-xl px-4 py-3 text-sm outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Password {isEditMode ? "(Opsional)" : "*"}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={
                      isEditMode
                        ? "Kosongkan jika tidak diubah"
                        : "Buat Password"
                    }
                    className="w-full border border-gray-300 focus:border-[#F8AF2F] focus:ring-1 focus:ring-[#F8AF2F] rounded-xl px-4 py-3 pr-12 text-sm outline-none"
                    required={!isEditMode}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPassword ? (
                      <HiEyeOff className="text-xl" />
                    ) : (
                      <HiEye className="text-xl" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3.5 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-8 py-3.5 bg-[#F8AF2F] text-white font-bold rounded-xl hover:bg-yellow-500 transition-colors shadow-sm cursor-pointer"
            >
              {isEditMode ? "Simpan Perubahan" : "Tambah"}
            </button>
          </div>
        </form>
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `.animate-fade-in { animation: fadeIn 0.2s ease-out; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`,
        }}
      />
    </div>
  );
};

export default AdminUserFormModal;
