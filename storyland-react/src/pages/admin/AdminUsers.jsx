import React, { useState, useEffect } from "react";
import {
  HiOutlineSearch,
  HiPlus,
  HiPencil,
  HiTrash,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi";

// IMPORT API & AUTH
import { useAuth } from "../../context/AuthContext";
import { getAdminUsers } from "../../services/api";
import { getImageUrl } from "../../utils/getImageUrl";
import { useAdminToast } from "../../context/AdminToastContext";

const AdminUsers = () => {
  const { token, user } = useAuth();
  const { showSuccess, showError } = useAdminToast();

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [activeRoleFilter, setActiveRoleFilter] = useState("Semua");

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // FETCH DATA DARI BACKEND
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAdminUsers(token);
        // Format role dari database ke format UI
        const formattedUsers = data.map((u) => {
          let roleUI = "User";
          if (u.role === "super_admin") roleUI = "Super Admin";
          else if (u.role === "admin") roleUI = "Admin";
          else if (u.role === "editor") roleUI = "Editor";

          return { ...u, roleUI };
        });
        setUsers(formattedUsers);
      } catch (err) {
        showError("Gagal mengambil data pengguna: " + err.message); // TOAST ERROR
      } finally {
        setIsLoading(false);
      }
    };
    if (token) fetchUsers();
  }, [token, showError]);

  // Reset pagination saat filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeRoleFilter]);

  // LOGIKA STATISTIK CARDS
  const superAdminCount = users.filter(
    (u) => u.roleUI === "Super Admin",
  ).length;
  const adminCount = users.filter((u) => u.roleUI === "Admin").length;
  const editorCount = users.filter((u) => u.roleUI === "Editor").length;

  // LOGIKA FILTERING
  const filteredUsers = users.filter((u) => {
    // Abaikan role "User" biasa, halaman ini hanya untuk memanajemen Admin Team
    if (u.roleUI === "User") return false;

    const matchSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole =
      activeRoleFilter === "Semua" || u.roleUI === activeRoleFilter;

    return matchSearch && matchRole;
  });

  // LOGIKA PAGINASI
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  // RENDER WARNA ROLE
  const renderRole = (role) => {
    if (role === "Super Admin")
      return <span className="text-orange-500 font-bold">{role}</span>;
    if (role === "Admin")
      return <span className="text-purple-600 font-bold">{role}</span>;
    if (role === "Editor")
      return <span className="text-blue-500 font-bold">{role}</span>;
    return role;
  };

  // RENDER STATUS
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

  return (
    <div className="p-8 md:p-12 w-full min-h-screen bg-gray-50 flex justify-center items-start">
      <div className="w-full max-w-6xl">
        {/* BARIS 1: SEARCH BAR */}
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

        {/* BARIS 2: HEADLINE & TOMBOL TAMBAH */}
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
            onClick={() =>
              showSuccess("Fitur Tambah Pengguna Segera Hadir! 🚀")
            }
            className="bg-[#F8AF2F] hover:bg-yellow-500 text-white font-bold px-6 py-3.5 rounded-xl shadow-sm transition-colors flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <HiPlus className="text-lg" /> Tambah Pengguna
          </button>
        </div>

        {/* BARIS 3: STATISTIK CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {/* Card Super Admin */}
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

          {/* Card Admin */}
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

          {/* Card Editor */}
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

        {/* BARIS 4: FILTER TABS & PAGINASI */}
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

          {/* Controls Paginasi */}
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

        {/* BARIS 5: TABEL DATA */}
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
                          showError("Fitur Hapus Segera Hadir! 🚀")
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
    </div>
  );
};

export default AdminUsers;
