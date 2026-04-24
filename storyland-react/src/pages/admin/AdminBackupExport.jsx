import React, { useState, useEffect } from "react";
import {
  HiOutlineSearch,
  HiCloudDownload,
  HiOutlineExternalLink,
  HiChevronDown,
} from "react-icons/hi";
import { getImageUrl } from "../../utils/getImageUrl";

// IMPORT API & AUTH
import { useAuth } from "../../context/AuthContext";
import { getAdminBooks, getAdminUsers } from "../../services/api";

const AdminBackupExport = () => {
  const { token } = useAuth();

  const [activeTab, setActiveTab] = useState("Data Buku");
  const [searchQuery, setSearchQuery] = useState("");

  // State Custom Dropdown
  const [dateFilter, setDateFilter] = useState("Bulan ini");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const filterOptions = [
    "Hari ini",
    "Minggu ini",
    "Bulan ini",
    "Tahun ini",
    "Pilih Rentang Waktu...",
  ];

  // State Data dari Backend
  const [booksData, setBooksData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // FETCH DATA DARI BACKEND
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // 1. Fetch Data Buku
        const books = await getAdminBooks(token);
        const formattedBooks = books.map((b) => ({
          id: b.id,
          title: b.title,
          category: b.category || "Tanpa Kategori",
          views: `${b.views_count} kali`,
          status: b.status === "terbit" ? "Aktif" : "Non Aktif",
          date: new Date(b.created_at).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
        }));
        setBooksData(formattedBooks);

        // 2. Fetch Data User Asli
        const users = await getAdminUsers(token);

        // Filter khusus pembaca
        const normalUsers = users.filter((u) => u.role === "user");

        const formattedUsers = normalUsers.map((u) => ({
          id: `0${u.id}`.slice(-2),
          name: u.name,
          avatar: u.avatar,
          email: u.email,
          readCount: "0 Buku",
          status: u.status === "active" ? "Aktif" : "Non Aktif",
          date: u.date,
        }));

        // Simpan data asli ke state (dan tidak ditimpa lagi)
        setUsersData(formattedUsers);
      } catch (err) {
        console.error("Gagal mengambil data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) fetchData();
  }, [token]);

  // Logika Filter Pencarian
  const filteredBooks = booksData.filter((b) =>
    (b.title || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredUsers = usersData.filter(
    (u) =>
      (u.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // LOGIKA EXPORT CSV (Javascript Murni)
  const handleExportCSV = () => {
    const dataToExport =
      activeTab === "Data Buku" ? filteredBooks : filteredUsers;

    if (dataToExport.length === 0) {
      return alert("Tidak ada data yang bisa diekspor.");
    }

    // 1. Ambil Header (Key dari JSON)
    const headers = Object.keys(dataToExport[0]);

    // 2. Map data ke dalam bentuk string CSV (Pisahkan dengan koma)
    const csvRows = dataToExport.map((row) => {
      return headers
        .map((fieldName) => {
          // Bungkus dengan tanda kutip ganda untuk menghindari error jika ada teks yang pakai koma
          return JSON.stringify(row[fieldName] || "");
        })
        .join(",");
    });

    // 3. Gabungkan Header dan Baris
    const csvContent = [headers.join(","), ...csvRows].join("\n");

    // 4. Buat File Blob dan Trigger Download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `Export_${activeTab.replace(" ", "_")}_${dateFilter}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Render Status Badge
  const renderStatus = (status) => {
    const isActive = status === "Aktif";
    return (
      <div
        className={`flex items-center gap-2 font-bold ${isActive ? "text-green-600" : "text-red-500"}`}
      >
        <span
          className={`w-2 h-2 rounded-full ${isActive ? "bg-green-600" : "bg-red-500"}`}
        ></span>
        {status}
      </div>
    );
  };

  return (
    <div className="p-8 md:p-12 w-full min-h-screen bg-gray-50 flex justify-center items-start">
      <div className="w-full max-w-6xl">
        {/* BARIS 1: SEARCH & CUSTOM FILTER */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          {/* Search Input */}
          <div className="relative flex-1 bg-white rounded-[20px] shadow-sm border border-gray-100 flex items-center px-5 py-4">
            <HiOutlineSearch className="text-gray-400 text-xl mr-3" />
            <input
              type="text"
              placeholder={
                activeTab === "Data Buku" ? "Search Buku" : "Search Pengguna"
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent outline-none text-sm font-medium text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* CUSTOM DROPDOWN FILTER WAKTU */}
          <div className="relative w-full md:w-56 shrink-0">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full bg-white rounded-[20px] shadow-sm border border-gray-100 px-5 py-4 flex items-center justify-between text-sm font-bold text-orange-500 cursor-pointer hover:border-orange-200 transition-colors"
            >
              {dateFilter}
              <HiChevronDown
                className={`text-lg transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Opsi Dropdown */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-100 shadow-xl rounded-[20px] overflow-hidden z-20 animate-fade-in">
                {filterOptions.map((opt) => (
                  <div
                    key={opt}
                    onClick={() => {
                      setDateFilter(opt);
                      setIsDropdownOpen(false);
                    }}
                    className={`px-5 py-3.5 text-sm font-bold cursor-pointer transition-colors ${
                      dateFilter === opt
                        ? "bg-orange-50 text-orange-500"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                    }`}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* BARIS 2: TABS & ACTION BUTTONS */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-6 border-b border-gray-200 pb-4">
          <div className="flex gap-8 px-2">
            {["Data Buku", "Data Pengguna"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setSearchQuery("");
                }}
                className={`text-xl font-black pb-4 -mb-4.5 transition-all border-b-4 cursor-pointer ${
                  activeTab === tab
                    ? "text-orange-500 border-orange-500"
                    : "text-gray-400 border-transparent hover:text-gray-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={() =>
                alert(
                  "Untuk membackup SQL Database secara penuh, silakan ekspor langsung melalui panel Aiven Cloud kamu.",
                )
              }
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm border-2 border-[#F8AF2F] text-[#F8AF2F] hover:bg-orange-50 transition-colors shadow-sm cursor-pointer"
            >
              <HiCloudDownload className="text-lg" /> Backup data
            </button>

            {/* TOMBOL EXPORT CSV AKTIF */}
            <button
              onClick={handleExportCSV}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-[#F8AF2F] hover:bg-yellow-500 text-white transition-colors shadow-sm cursor-pointer"
            >
              <HiOutlineExternalLink className="text-lg" /> Export CSV
            </button>
          </div>
        </div>

        {/* BARIS 3: TABEL DATA */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto min-h-100">
          <table className="w-full text-left min-w-200">
            {/* Header Data Buku */}
            {activeTab === "Data Buku" && (
              <>
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="py-5 px-6 text-sm font-bold text-gray-800">
                      ID
                    </th>
                    <th className="py-5 px-6 text-sm font-bold text-gray-800">
                      Judul Buku
                    </th>
                    <th className="py-5 px-6 text-sm font-bold text-gray-800">
                      Kategori
                    </th>
                    <th className="py-5 px-6 text-sm font-bold text-gray-800">
                      Total Dibaca
                    </th>
                    <th className="py-5 px-6 text-sm font-bold text-gray-800">
                      Status
                    </th>
                    <th className="py-5 px-6 text-sm font-bold text-gray-800">
                      Tanggal Tambah
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="py-10 text-center font-bold text-gray-400"
                      >
                        Memuat Data...
                      </td>
                    </tr>
                  ) : (
                    filteredBooks.map((book, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-gray-50 hover:bg-orange-50/30 transition-colors cursor-default"
                      >
                        <td className="py-4 px-6 text-sm font-bold text-gray-600">
                          {book.id}
                        </td>
                        <td className="py-4 px-6 text-sm font-bold text-gray-800">
                          {book.title}
                        </td>
                        <td className="py-4 px-6 text-sm font-bold text-gray-600">
                          {book.category}
                        </td>
                        <td className="py-4 px-6 text-sm font-bold text-gray-600">
                          {book.views}
                        </td>
                        <td className="py-4 px-6">
                          {renderStatus(book.status)}
                        </td>
                        <td className="py-4 px-6 text-sm font-bold text-gray-600">
                          {book.date}
                        </td>
                      </tr>
                    ))
                  )}
                  {!isLoading && filteredBooks.length === 0 && (
                    <tr>
                      <td
                        colSpan="6"
                        className="py-10 text-center text-gray-400 font-bold"
                      >
                        Data buku tidak ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </>
            )}

            {/* Header Data Pengguna */}
            {activeTab === "Data Pengguna" && (
              <>
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
                      Buku Dibaca
                    </th>
                    <th className="py-5 px-6 text-sm font-bold text-gray-800">
                      Status
                    </th>
                    <th className="py-5 px-6 text-sm font-bold text-gray-800">
                      Tanggal Daftar
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-gray-50 hover:bg-orange-50/30 transition-colors cursor-default"
                    >
                      {/* id */}
                      <td className="py-4 px-6 text-sm font-bold text-gray-600">
                        {user.id}
                      </td>
                      {/* nama */}
                      <td className="py-4 px-6 text-sm font-bold text-gray-800">
                        {user.name}
                      </td>
                      {/* ava + email */}
                      <td className="py-4 px-6 text-sm font-bold text-gray-600 flex items-center gap-3">
                        <img
                          src={getImageUrl(user.avatar)}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover bg-gray-200"
                        />
                        {user.email}
                      </td>
                      {/* jumlah baca */}
                      <td className="py-4 px-6 text-sm font-bold text-gray-600">
                        {user.readCount}
                      </td>
                      {/* status */}
                      <td className="py-4 px-6">{renderStatus(user.status)}</td>
                      {/* tgl daftar */}
                      <td className="py-4 px-6 text-sm font-bold text-gray-600">
                        {user.date}
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td
                        colSpan="6"
                        className="py-10 text-center text-gray-400 font-bold"
                      >
                        Data pengguna tidak ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </>
            )}
          </table>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .animate-fade-in { animation: fadeIn 0.2s ease-out; transform-origin: top; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px) scaleY(0.9); } to { opacity: 1; transform: translateY(0) scaleY(1); } }
      `,
        }}
      />
    </div>
  );
};

export default AdminBackupExport;
