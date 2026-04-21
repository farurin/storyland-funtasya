import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import {
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiUpload,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi";

// --- MOCK DATA (Data Statis Sementara) ---
const statCards = [
  {
    id: 1,
    count: 120,
    label: "Proses Review",
    icon: <HiOutlineClock className="w-8 h-8 text-orange-500" />,
    bgIcon: "bg-orange-50",
    borderColor: "border-orange-400",
  },
  {
    id: 2,
    count: 20,
    label: "Buku Terbit",
    icon: <HiOutlineCheckCircle className="w-8 h-8 text-amber-500" />,
    bgIcon: "bg-amber-50",
    borderColor: "border-amber-400",
  },
  {
    id: 3,
    count: 10,
    label: "Buku dibatalkan",
    icon: <HiOutlineXCircle className="w-8 h-8 text-yellow-500" />,
    bgIcon: "bg-yellow-50",
    borderColor: "border-yellow-400",
  },
];

const tabs = [
  "Proses Review",
  "Buku Terbit",
  "Buku ditolak",
  "Arsip",
  "Dihapus",
];

const mockBooks = [
  {
    id: 1,
    title: "Nabi Nuh dan Banjir Besar",
    desc: "Kisah Nabi Nuh yang sabar mengajak kaumnya berbuat baik. Ketika banjir...",
    author: "Alan cikuy",
    date: "12 February 2026",
    category: "Cerita Hewan",
    language: "Indonesia",
    status: "Review",
    image: "https://via.placeholder.com/150x200?text=Nabi+Nuh",
  },
  {
    id: 2,
    title: "Bebek ingin Terbang",
    desc: "Seekor bebek kecil yang suka memasak mencoba membuat kue p...",
    author: "Alan cikuy",
    date: "12 February 2026",
    category: "Cerita Hewan",
    language: "Indonesia",
    status: "Review",
    image: "https://via.placeholder.com/150x200?text=Bebek",
  },
  {
    id: 3,
    title: "Malin Kundang",
    desc: "Malin adalah anak yang merantau untuk mencari kehidupan yang lebi...",
    author: "Alan cikuy",
    date: "12 February 2026",
    category: "Cerita Hewan",
    language: "Indonesia",
    status: "Review",
    image: "https://via.placeholder.com/150x200?text=Malin",
  },
  {
    id: 4,
    title: "Pegasus Kuda Terbang",
    desc: "Seekor kuda bersayap bernama Pegasus bermimpi terbang lebih tin...",
    author: "Alan cikuy",
    date: "12 February 2026",
    category: "Cerita Hewan",
    language: "Indonesia",
    status: "Review",
    image: "https://via.placeholder.com/150x200?text=Pegasus",
  },
];

const AdminBooks = () => {
  const [activeTab, setActiveTab] = useState("Proses Review");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto w-full">
      {/* HEADER */}
      <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-8">
        Manajemen Buku
      </h1>

      {/* SEARCH & ADD BUTTON */}
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
        <button className="w-full sm:w-auto shrink-0 bg-[#FDECA2] hover:bg-yellow-200 text-amber-700 font-bold px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 transition shadow-sm">
          <HiUpload className="text-lg" /> Tambah Cerita
        </button>
      </div>

      {/* STAT CARDS */}
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

      {/* TABS & PAGINATION */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex gap-6 overflow-x-auto w-full border-b border-gray-200 hide-scrollbar pb-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-bold transition-all whitespace-nowrap border-b-[3px] ${
                activeTab === tab
                  ? "border-orange-400 text-orange-500"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center gap-4 shrink-0 font-bold text-gray-900 text-sm">
          <span>5 dari 20</span>
          <div className="flex gap-2">
            <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm hover:bg-gray-50 border border-gray-100">
              <HiChevronLeft />
            </button>
            <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm hover:bg-gray-50 border border-gray-100">
              <HiChevronRight />
            </button>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
        <table className="w-full text-left min-w-200">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="py-5 px-6 text-sm font-bold text-gray-900 w-[35%]">
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
                Bahasa
              </th>
              <th className="py-5 px-6 text-sm font-bold text-gray-900">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {mockBooks.map((book, index) => (
              <tr
                key={book.id}
                className={`group hover:bg-gray-50 transition cursor-pointer ${
                  index !== mockBooks.length - 1
                    ? "border-b border-gray-100"
                    : ""
                }`}
              >
                <td className="py-4 px-6 flex items-center gap-4">
                  <div className="w-14 h-18 rounded-lg overflow-hidden shrink-0 bg-gray-200">
                    <img
                      src={book.image}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-1">
                      {book.title}
                    </h4>
                    <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                      {book.desc}
                    </p>
                  </div>
                </td>
                <td className="py-4 px-6 text-xs font-semibold text-gray-500">
                  {book.author}
                </td>
                <td className="py-4 px-6 text-xs font-semibold text-gray-500">
                  {book.date}
                </td>
                <td className="py-4 px-6 text-xs font-semibold text-gray-500">
                  {book.category}
                </td>
                <td className="py-4 px-6 text-xs font-semibold text-gray-500">
                  {book.language}
                </td>
                <td className="py-4 px-6 text-xs font-bold text-yellow-500">
                  {book.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBooks;
