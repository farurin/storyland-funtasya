import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import {
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiUpload,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi";

import { useAuth } from "../../context/AuthContext";
import { getAdminBooks } from "../../services/api";
import { getImageUrl } from "../../utils/getImageUrl";
import { useAdminToast } from "../../context/AdminToastContext";

const tabs = [
  "Proses Review",
  "Buku Terbit",
  "Buku ditolak",
  "Arsip",
  "Dihapus",
];

const getStatusFromTab = (tab) => {
  switch (tab) {
    case "Proses Review":
      return "review";
    case "Buku Terbit":
      return "terbit";
    case "Buku ditolak":
      return "ditolak";
    case "Arsip":
      return "arsip";
    case "Dihapus":
      return "dihapus";
    default:
      return "review";
  }
};

const AdminBooks = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { showError } = useAdminToast();

  const [activeTab, setActiveTab] = useState("Proses Review");
  const [searchQuery, setSearchQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchBooks = async () => {
      if (!token) return;
      try {
        const data = await getAdminBooks(token);
        setBooks(data);
      } catch (error) {
        showError("Gagal menarik data buku: " + error.message); // GUNAKAN TOAST
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooks();
  }, [token, showError]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  const reviewCount = books.filter(
    (b) => (b.status || "review").toLowerCase() === "review",
  ).length;
  const terbitCount = books.filter(
    (b) => (b.status || "").toLowerCase() === "terbit",
  ).length;
  const ditolakCount = books.filter(
    (b) => (b.status || "").toLowerCase() === "ditolak",
  ).length;

  const statCards = [
    {
      id: 1,
      count: reviewCount,
      label: "Proses Review",
      icon: <HiOutlineClock className="w-8 h-8 text-orange-500" />,
      bgIcon: "bg-orange-50",
      borderColor: "border-orange-400",
    },
    {
      id: 2,
      count: terbitCount,
      label: "Buku Terbit",
      icon: <HiOutlineCheckCircle className="w-8 h-8 text-amber-500" />,
      bgIcon: "bg-amber-50",
      borderColor: "border-amber-400",
    },
    {
      id: 3,
      count: ditolakCount,
      label: "Buku dibatalkan",
      icon: <HiOutlineXCircle className="w-8 h-8 text-yellow-500" />,
      bgIcon: "bg-yellow-50",
      borderColor: "border-yellow-400",
    },
  ];

  const currentStatusTarget = getStatusFromTab(activeTab);

  const filteredBooks = books.filter((book) => {
    const matchStatus =
      (book.status || "review").toLowerCase() === currentStatusTarget;
    const matchSearch = book.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBooks = filteredBooks.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto w-full">
      <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-8">
        Manajemen Buku
      </h1>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-10">
        <div className="relative w-full">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
          <input
            type="text"
            placeholder="Search Buku"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border-none pl-12 pr-4 py-3.5 rounded-xl shadow-sm focus:ring-2 focus:ring-yellow-400 outline-none text-gray-700 font-medium"
          />
        </div>
        <Link
          to="/admin/tambah"
          className="w-full sm:w-auto shrink-0 bg-[#FDECA2] hover:bg-yellow-200 text-amber-700 font-bold px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 transition shadow-sm cursor-pointer"
        >
          <HiUpload className="text-lg" /> Tambah Cerita
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {statCards.map((stat) => (
          <div
            key={stat.id}
            className={`bg-white rounded-2xl p-6 flex items-center gap-5 shadow-sm border-l-12px ${stat.borderColor}`}
          >
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${stat.bgIcon}`}
            >
              {stat.icon}
            </div>
            <div>
              <h3 className="text-3xl font-black text-gray-900 leading-tight">
                {stat.count}
              </h3>
              <p className="text-sm font-semibold text-gray-400 mt-1">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex gap-6 overflow-x-auto w-full border-b border-gray-200 hide-scrollbar pb-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-bold transition-all whitespace-nowrap border-b-[3px] cursor-pointer ${
                activeTab === tab
                  ? "border-orange-400 text-orange-500"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 shrink-0 font-bold text-gray-900 text-sm">
          <span className="text-gray-500 font-medium">
            {filteredBooks.length > 0 ? startIndex + 1 : 0} -{" "}
            {Math.min(startIndex + itemsPerPage, filteredBooks.length)} dari{" "}
            {filteredBooks.length}
          </span>
          <div className="flex gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm hover:bg-gray-50 border border-gray-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <HiChevronLeft />
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm hover:bg-gray-50 border border-gray-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <HiChevronRight />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
        <table className="w-full text-left min-w-200">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="py-5 px-6 text-sm font-bold text-gray-900 w-[40%]">
                Konten
              </th>
              <th className="py-5 px-6 text-sm font-bold text-gray-900">
                Nama Autor
              </th>
              <th className="py-5 px-6 text-sm font-bold text-gray-900">
                Tanggal Terbit
              </th>
              <th className="py-5 px-6 text-sm font-bold text-gray-900">
                Kategori
              </th>
              <th className="py-5 px-6 text-sm font-bold text-gray-900">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan="5"
                  className="py-10 text-center text-gray-500 font-medium"
                >
                  Memuat data buku...
                </td>
              </tr>
            ) : paginatedBooks.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="py-10 text-center text-gray-500 font-medium"
                >
                  Belum ada buku di tab ini.
                </td>
              </tr>
            ) : (
              paginatedBooks.map((book, index) => (
                <tr
                  key={book.id}
                  onClick={() => navigate(`/admin/books/${book.id}`)}
                  className={`group hover:bg-orange-50/30 transition cursor-pointer ${index !== paginatedBooks.length - 1 ? "border-b border-gray-100" : ""}`}
                >
                  <td className="py-4 px-6 flex items-center gap-4">
                    <div className="w-12 h-16 rounded-md overflow-hidden shrink-0 bg-gray-100 border border-gray-200">
                      <img
                        src={getImageUrl(book.image)}
                        alt={book.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/150x200?text=No+Cover";
                        }}
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 mb-1 leading-snug group-hover:text-orange-500 transition-colors">
                        {book.title}
                      </h4>
                      <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                        {book.description || "Tidak ada deskripsi."}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-xs font-semibold text-gray-600">
                    {book.author || "Funtasya Team"}
                  </td>
                  <td className="py-4 px-6 text-xs font-semibold text-gray-600">
                    {book.created_at
                      ? new Date(book.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "-"}
                  </td>
                  <td className="py-4 px-6 text-xs font-bold text-orange-500">
                    {book.category || "-"}
                  </td>
                  <td className="py-4 px-6 text-xs font-bold">
                    <span
                      className={`px-3 py-1.5 rounded-lg border ${
                        book.status === "terbit"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : book.status === "review"
                            ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                            : book.status === "ditolak" ||
                                book.status === "dihapus"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : "bg-gray-50 text-gray-700 border-gray-200"
                      }`}
                    >
                      {book.status ? book.status.toUpperCase() : "REVIEW"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `.hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`,
        }}
      />
    </div>
  );
};

export default AdminBooks;
