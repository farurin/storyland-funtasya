import React, { useState, useEffect } from "react";
import {
  HiOutlineSearch,
  HiPlus,
  HiPencil,
  HiTrash,
  HiChevronLeft,
  HiChevronRight,
  HiX,
  HiEye,
  HiEyeOff,
} from "react-icons/hi";

import { useAuth } from "../../context/AuthContext";
import { getAdminUsers, createAdminUser } from "../../services/api";
import { getImageUrl } from "../../utils/getImageUrl";
import { useAdminToast } from "../../context/AdminToastContext";
import AdminConfirmModal from "../../components/admin/AdminConfirmModal";

// Ikon khusus untuk Modal Tambah Pengguna
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

const AdminUsers = () => {
  const { token, user } = useAuth();
  const { showSuccess, showError, showLoading } = useAdminToast();

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeRoleFilter, setActiveRoleFilter] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // STATE UNTUK MODAL DELETE
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    userTarget: null,
  });

  // STATE UNTUK MODAL TAMBAH PENGGUNA
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    password: "",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAdminUsers(token);
        const formattedUsers = data.map((u) => {
          let roleUI = "User";
          if (u.role === "super_admin") roleUI = "Super Admin";
          else if (u.role === "admin") roleUI = "Admin";
          else if (u.role === "editor") roleUI = "Editor";
          return { ...u, roleUI };
        });
        setUsers(formattedUsers);
      } catch (err) {
        showError("Gagal mengambil data pengguna: " + err.message);
      } finally {
        setIsLoading(false);
      }
    };
    if (token) fetchUsers();
  }, [token, showError]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeRoleFilter]);

  const superAdminCount = users.filter(
    (u) => u.roleUI === "Super Admin",
  ).length;
  const adminCount = users.filter((u) => u.roleUI === "Admin").length;
  const editorCount = users.filter((u) => u.roleUI === "Editor").length;

  const filteredUsers = users.filter((u) => {
    if (u.roleUI === "User") return false;
    const matchSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole =
      activeRoleFilter === "Semua" || u.roleUI === activeRoleFilter;
    return matchSearch && matchRole;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const renderRole = (role) => {
    if (role === "Super Admin")
      return <span className="text-orange-500 font-bold">{role}</span>;
    if (role === "Admin")
      return <span className="text-purple-600 font-bold">{role}</span>;
    if (role === "Editor")
      return <span className="text-blue-500 font-bold">{role}</span>;
    return role;
  };

  const renderStatus = (status) => {
    const isActive = status === "active";
    return (
      <div
        className={`flex items-center gap-2 font-bold ${isActive ? "text-green-600" : "text-red-500"}`}
      >
        <span
          className={`w-2 h-2 rounded-full ${isActive ? "bg-green-600" : "bg-red-500"}`}
        ></span>
        {isActive ? "Aktif" : "Non Aktif"}
      </div>
    );
  };

  // MOCK FUNGSI HAPUS USER
  const confirmDeleteUser = () => {
    setDeleteModal({ isOpen: false, userTarget: null });
    showError("Fitur Hapus User API belum tersedia di Backend! 🚀");
  };

  // HANDLER FORM TAMBAH PENGGUNA
  const handleNewUserChange = (e) => {
    setNewUserForm({ ...newUserForm, [e.target.name]: e.target.value });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();

    if (
      !newUserForm.firstName ||
      !newUserForm.email ||
      !newUserForm.role ||
      !newUserForm.password
    ) {
      return showError(
        "Harap lengkapi semua kolom wajib (Nama Depan, Email, Role, Password).",
      );
    }

    showLoading(true);
    try {
      await createAdminUser(newUserForm, token);

      showSuccess("Pengguna baru berhasil ditambahkan!");
      setIsAddModalOpen(false);
      setNewUserForm({
        firstName: "",
        lastName: "",
        email: "",
        role: "",
        password: "",
      });

      // PANGGIL ULANG DATA AGAR TABEL LANGSUNG TER-UPDATE TANPA REFRESH
      const data = await getAdminUsers(token);
      const formattedUsers = data.map((u) => {
        let roleUI = "User";
        if (u.role === "super_admin") roleUI = "Super Admin";
        else if (u.role === "admin") roleUI = "Admin";
        else if (u.role === "editor") roleUI = "Editor";
        return { ...u, roleUI };
      });
      setUsers(formattedUsers);
    } catch (err) {
      showError("Gagal menambahkan pengguna: " + err.message);
    } finally {
      showLoading(false);
    }
  };

  return (
    <div className="p-8 md:p-12 w-full min-h-screen bg-gray-50 flex justify-center items-start">
      <div className="w-full max-w-6xl">
        <div className="w-full bg-white rounded-[20px] shadow-sm border border-gray-100 flex items-center px-5 py-4 mb-10">
          <HiOutlineSearch className="text-gray-400 text-xl mr-3" />
          <input
            type="text"
            placeholder="Search Pengguna"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent outline-none text-sm font-medium text-gray-700 placeholder-gray-400"
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-gray-900 flex items-center gap-2">
              Halo {user?.first_name || "Admin"}!{" "}
              <span className="text-2xl">👋</span>
            </h1>
            <p className="text-gray-500 font-medium text-sm mt-1">
              Kelola tim admin dan berikan akses sesuai wewenang.
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#F8AF2F] hover:bg-yellow-500 text-white font-bold px-6 py-3.5 rounded-xl shadow-sm transition-colors flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <HiPlus className="text-lg" /> Tambah Pengguna
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          <div className="bg-[#E87B11] rounded-3xl p-6 flex items-center gap-5 shadow-sm text-white">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shrink-0">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#E87B11"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-black mb-1">Super Admin</h3>
              <p className="text-sm font-medium opacity-90">
                {superAdminCount} Pengguna
              </p>
            </div>
          </div>
          <div className="bg-[#8E3B87] rounded-3xl p-6 flex items-center gap-5 shadow-sm text-white">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shrink-0">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#8E3B87"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <polyline points="17 11 19 13 23 9"></polyline>
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-black mb-1">Admin</h3>
              <p className="text-sm font-medium opacity-90">
                {adminCount} Pengguna
              </p>
            </div>
          </div>
          <div className="bg-[#1DA1F2] rounded-3xl p-6 flex items-center gap-5 shadow-sm text-white">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shrink-0">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1DA1F2"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-black mb-1">Editor</h3>
              <p className="text-sm font-medium opacity-90">
                {editorCount} Pengguna
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex flex-wrap gap-3">
            {["Semua", "Super Admin", "Admin", "Editor"].map((role) => (
              <button
                key={role}
                onClick={() => setActiveRoleFilter(role)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-colors border cursor-pointer ${
                  activeRoleFilter === role
                    ? "bg-white text-orange-500 border-orange-400 shadow-sm"
                    : "bg-white text-gray-500 border-transparent hover:border-gray-200"
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 shrink-0 font-bold text-gray-900 text-sm bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm">
            <span>
              {filteredUsers.length > 0 ? startIndex + 1 : 0} -{" "}
              {Math.min(startIndex + itemsPerPage, filteredUsers.length)} dari{" "}
              {filteredUsers.length}
            </span>
            <div className="flex gap-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="p-1 hover:text-orange-500 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <HiChevronLeft className="text-xl" />
              </button>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="p-1 hover:text-orange-500 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <HiChevronRight className="text-xl" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto min-h-100">
          <table className="w-full text-left min-w-225">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="py-5 px-6 text-sm font-bold text-gray-800">
                  ID
                </th>
                <th className="py-5 px-6 text-sm font-bold text-gray-800">
                  Nama
                </th>
                <th className="py-5 px-6 text-sm font-bold text-gray-800">
                  Email
                </th>
                <th className="py-5 px-6 text-sm font-bold text-gray-800">
                  Role
                </th>
                <th className="py-5 px-6 text-sm font-bold text-gray-800">
                  Status
                </th>
                <th className="py-5 px-6 text-sm font-bold text-gray-800">
                  Ditambahkan
                </th>
                <th className="py-5 px-6 text-sm font-bold text-gray-800 text-center">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="py-10 text-center font-bold text-gray-400"
                  >
                    Memuat Data...
                  </td>
                </tr>
              ) : paginatedUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="py-10 text-center font-bold text-gray-400"
                  >
                    Tidak ada admin/editor yang ditemukan.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((u, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-50 hover:bg-orange-50/30 transition-colors cursor-default"
                  >
                    <td className="py-4 px-6 text-sm font-bold text-gray-600">
                      {`0${u.id}`.slice(-2)}
                    </td>
                    <td className="py-4 px-6 text-sm font-bold text-gray-800 flex items-center gap-3">
                      <img
                        src={getImageUrl(u.avatar)}
                        alt={u.name}
                        className="w-8 h-8 rounded-full object-cover bg-gray-200 shadow-sm"
                      />
                      {u.name}
                    </td>
                    <td className="py-4 px-6 text-sm font-bold text-gray-600">
                      {u.email}
                    </td>
                    <td className="py-4 px-6">{renderRole(u.roleUI)}</td>
                    <td className="py-4 px-6">{renderStatus(u.status)}</td>
                    <td className="py-4 px-6 text-sm font-bold text-gray-600">
                      {u.date}
                    </td>
                    <td className="py-4 px-6 flex items-center justify-center gap-2">
                      <button
                        onClick={() =>
                          showSuccess("Fitur Edit Segera Hadir! 🚀")
                        }
                        className="p-2 bg-[#F8AF2F] hover:bg-yellow-500 text-white rounded-lg shadow-sm transition-colors cursor-pointer"
                        title="Edit Pengguna"
                      >
                        <HiPencil />
                      </button>
                      <button
                        onClick={() =>
                          setDeleteModal({ isOpen: true, userTarget: u })
                        }
                        className="p-2 bg-[#EF4444] hover:bg-red-600 text-white rounded-lg shadow-sm transition-colors cursor-pointer"
                        title="Hapus Pengguna"
                      >
                        <HiTrash />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL TAMBAH PENGGUNA */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-110 p-4 animate-fade-in">
          <div className="bg-white w-full max-w-150 rounded-4xl p-8 shadow-2xl relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-8 right-8 text-gray-400 hover:text-gray-900 transition-colors cursor-pointer"
            >
              <HiX className="text-2xl" />
            </button>

            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-yellow-100 text-yellow-500 rounded-full flex items-center justify-center">
                <IconAddUser />
              </div>
              <h2 className="text-2xl font-black text-gray-900">
                Tambah Pengguna
              </h2>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Kolom Kiri: Nama & Role */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Nama Depan *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={newUserForm.firstName}
                      onChange={handleNewUserChange}
                      placeholder="Lengkapi nama depan"
                      className="w-full border border-gray-300 focus:border-[#F8AF2F] focus:ring-1 focus:ring-[#F8AF2F] rounded-xl px-4 py-3 text-sm outline-none transition-colors"
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
                      value={newUserForm.lastName}
                      onChange={handleNewUserChange}
                      placeholder="Lengkapi nama belakang"
                      className="w-full border border-gray-300 focus:border-[#F8AF2F] focus:ring-1 focus:ring-[#F8AF2F] rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Role *
                    </label>
                    <select
                      name="role"
                      value={newUserForm.role}
                      onChange={handleNewUserChange}
                      className="w-full border border-gray-300 focus:border-[#F8AF2F] focus:ring-1 focus:ring-[#F8AF2F] rounded-xl px-4 py-3 text-sm outline-none transition-colors text-gray-600 bg-white"
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

                {/* Kolom Kanan: Email & Password */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={newUserForm.email}
                      onChange={handleNewUserChange}
                      placeholder="Lengkapi Email"
                      className="w-full border border-gray-300 focus:border-[#F8AF2F] focus:ring-1 focus:ring-[#F8AF2F] rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={newUserForm.password}
                        onChange={handleNewUserChange}
                        placeholder="Buat Password"
                        className="w-full border border-gray-300 focus:border-[#F8AF2F] focus:ring-1 focus:ring-[#F8AF2F] rounded-xl px-4 py-3 pr-12 text-sm outline-none transition-colors"
                        required
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
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-8 py-3.5 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3.5 bg-[#F8AF2F] text-white font-bold rounded-xl hover:bg-yellow-500 transition-colors shadow-sm"
                >
                  Tambah
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI HAPUS */}
      <AdminConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, userTarget: null })}
        onConfirm={confirmDeleteUser}
        title="Hapus Akun Tim?"
        description={`Apakah anda yakin ingin mencabut akses dan menghapus akun "${deleteModal.userTarget?.name}"?`}
        warningText="Tindakan ini tidak dapat dibatalkan. Pengguna ini tidak akan bisa lagi login ke panel admin."
        variant="danger"
        confirmText="Cabut Akses"
      />

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .animate-fade-in { animation: fadeIn 0.2s ease-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `,
        }}
      />
    </div>
  );
};

export default AdminUsers;
