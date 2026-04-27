import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import {
  HiBookOpen,
  HiUsers,
  HiTag,
  HiEye,
  HiCalendar,
  HiChevronRight,
} from "react-icons/hi";
import { Link } from "react-router-dom";

// IMPORT API & UTILS
import { useAuth } from "../../context/AuthContext";
import { getAdminDashboardStats, getAdminProfile } from "../../services/api";
import { getImageUrl } from "../../utils/getImageUrl";
import { useAdminToast } from "../../context/AdminToastContext";

ChartJS.register(ArcElement, Tooltip, Legend);

const tabs = ["Paling Populer", "Terbaru", "Download"];

export default function AdminDashboard() {
  const { token } = useAuth();
  const { showError } = useAdminToast();

  const [activeTab, setActiveTab] = useState("Paling Populer");
  const [isLoading, setIsLoading] = useState(true);
  const [adminProfile, setAdminProfile] = useState(null);

  // State Data Dashboard
  const [data, setData] = useState({
    stats: { totalBooks: 0, totalUsers: 0, totalViews: 0, totalCategories: 0 },
    bookStatus: { popular: [], latest: [], downloaded: [] },
    demography: [],
    recentSidebarBooks: [],
    authors: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) return;
      try {
        const [dashboardRes, profileRes] = await Promise.all([
          getAdminDashboardStats(token),
          getAdminProfile(token),
        ]);
        setData(dashboardRes);
        setAdminProfile(profileRes);
      } catch (err) {
        showError("Gagal memuat dashboard: " + err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, [token, showError]);

  // Siapkan Data untuk Doughnut Chart
  const doughnutData = {
    labels: data.demography.map((d) => d.label),
    datasets: [
      {
        data: data.demography.map((d) => d.count),
        backgroundColor: data.demography.map((d) => d.color),
        borderWidth: 3,
        borderColor: "#fff",
      },
    ],
  };

  const doughnutOptions = {
    cutout: "65%",
    plugins: { legend: { display: false }, tooltip: { enabled: true } },
  };

  // Tentukan list buku berdasarkan tab aktif
  const displayedBooks =
    activeTab === "Paling Populer"
      ? data.bookStatus.popular
      : activeTab === "Terbaru"
        ? data.bookStatus.latest
        : data.bookStatus.downloaded;

  if (isLoading)
    return (
      <div className="p-12 text-center text-gray-500 font-bold">
        Memuat Dashboard...
      </div>
    );

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 md:p-8 min-h-screen bg-gray-50 w-full max-w-400 mx-auto">
      {/* ════ LEFT COLUMN (Utama) ════ */}
      <div className="flex-1 flex flex-col gap-6 min-w-0">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-[20px] p-5 flex items-center gap-4 shadow-sm border border-gray-100">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-red-50 text-red-500">
              <HiBookOpen className="w-8 h-8" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-800 leading-tight">
                {data.stats.totalBooks}
              </p>
              <p className="text-xs text-slate-500 font-semibold">Total Buku</p>
            </div>
          </div>
          <div className="bg-white rounded-[20px] p-5 flex items-center gap-4 shadow-sm border border-gray-100">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-orange-50 text-orange-400">
              <HiUsers className="w-8 h-8" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-800 leading-tight">
                {data.stats.totalUsers > 1000
                  ? (data.stats.totalUsers / 1000).toFixed(1) + "k"
                  : data.stats.totalUsers}
              </p>
              <p className="text-xs text-slate-500 font-semibold">Pengguna</p>
            </div>
          </div>
          <div className="bg-white rounded-[20px] p-5 flex items-center gap-4 shadow-sm border border-gray-100">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-yellow-50 text-yellow-500">
              <HiTag className="w-8 h-8" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-800 leading-tight">
                {data.stats.totalCategories}
              </p>
              <p className="text-xs text-slate-500 font-semibold">Kategori</p>
            </div>
          </div>
          <div className="bg-white rounded-[20px] p-5 flex items-center gap-4 shadow-sm border border-gray-100">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-blue-50 text-blue-500">
              <HiEye className="w-8 h-8" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-800 leading-tight">
                {data.stats.totalViews > 1000
                  ? (data.stats.totalViews / 1000).toFixed(1) + "k"
                  : data.stats.totalViews}
              </p>
              <p className="text-xs text-slate-500 font-semibold">Kunjungan</p>
            </div>
          </div>
        </div>

        {/* Status Buku */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-black text-slate-800 mb-4">
            Status Buku
          </h2>

          <div className="flex gap-6 mb-6 border-b border-gray-100">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-bold transition-all border-b-[3px] -mb-px ${activeTab === tab ? "border-orange-400 text-orange-500" : "border-transparent text-slate-400 hover:text-slate-600"}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {displayedBooks.map((book) => (
              <Link
                to={`/admin/books/${book.id}`}
                key={book.id}
                className="flex flex-col gap-3 group cursor-pointer"
              >
                <div className="w-full aspect-3/4 rounded-2xl overflow-hidden bg-gray-100 shadow-sm group-hover:shadow-md transition-all">
                  <img
                    src={getImageUrl(book.img)}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/300x400?text=Cover";
                    }}
                  />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-800 leading-snug line-clamp-2 group-hover:text-orange-500 transition-colors">
                    {book.title}
                  </p>
                  <p className="text-xs text-slate-500 font-bold mt-1">
                    {book.author || "Funtasya Team"}
                  </p>
                  <p className="text-[11px] text-slate-400 font-semibold italic truncate">
                    {book.category}
                  </p>
                </div>
              </Link>
            ))}
            {displayedBooks.length === 0 && (
              <p className="col-span-4 text-center text-sm text-gray-400 py-10">
                Belum ada buku di kategori ini.
              </p>
            )}
          </div>
        </div>

        {/* Statistik Demography */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-black text-slate-800 mb-6">
            Statistik Demography
          </h2>
          <div className="flex flex-col md:flex-row gap-10 items-center justify-between">
            {/* Bar List */}
            <div className="flex-1 w-full flex flex-col gap-4">
              {data.demography.map((d) => (
                <div key={d.label} className="flex items-center gap-4">
                  <p className="w-32 md:w-40 text-[13px] text-slate-600 font-bold truncate">
                    {d.label}
                  </p>
                  <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${d.pct}%`, backgroundColor: d.color }}
                    />
                  </div>
                  <p className="w-12 text-sm font-black text-slate-700 text-right">
                    {d.pct}%
                  </p>
                </div>
              ))}
            </div>

            {/* Doughnut Chart */}
            <div className="w-56 h-56 shrink-0 relative">
              <Doughnut data={doughnutData} options={doughnutOptions} />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                  Total Buku
                </p>
                <p className="text-3xl font-black text-slate-800">
                  {data.stats.totalBooks}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ════ RIGHT COLUMN (Sidebar) ════ */}
      <div className="w-full lg:w-72 flex flex-col gap-6 shrink-0">
        {/* User Profile */}
        <Link
          to="/admin/settings"
          className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow block"
        >
          <div className="flex items-center gap-4 mb-4">
            <img
              src={
                adminProfile?.avatar_url
                  ? getImageUrl(adminProfile.avatar_url)
                  : "https://placehold.co/150x150?text=Avatar"
              }
              alt="Admin Avatar"
              className="w-12 h-12 rounded-full object-cover bg-gray-100 shadow-sm"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/150x150?text=Avatar";
              }}
            />
            <div className="min-w-0">
              <p className="text-sm font-black text-slate-800 truncate">
                {adminProfile?.first_name
                  ? `${adminProfile.first_name} ${adminProfile.last_name}`
                  : "Admin Funtasya"}
              </p>
              <p className="text-[11px] text-slate-400 font-semibold truncate">
                {adminProfile?.email || "admin@funtasya.com"}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <p className="text-[11px] font-black text-slate-500">
              {new Date().toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <HiCalendar className="w-5 h-5 text-slate-300" />
          </div>
        </Link>

        {/* Manajemen Buku (Recent) */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex-1">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-black text-slate-800">
              Manajemen Buku
            </h3>
            <Link
              to="/admin/perpustakaan"
              className="text-[10px] font-black text-orange-500 hover:text-orange-600 flex items-center uppercase tracking-wider"
            >
              Lihat Semua <HiChevronRight className="w-4 h-4 ml-0.5" />
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            {data.recentSidebarBooks.map((b) => (
              <Link
                to={`/admin/books/${b.id}`}
                key={b.id}
                className="flex items-center gap-3 group"
              >
                <img
                  src={getImageUrl(b.img)}
                  alt={b.title}
                  className="w-12 h-14 rounded-lg object-cover shadow-sm group-hover:scale-105 transition-transform"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/100x140?text=Cover";
                  }}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-black text-slate-800 truncate group-hover:text-orange-500 transition-colors">
                    {b.title}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                    {b.author || "Funtasya Team"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Manajemen Autor */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-black text-slate-800">
              Manajemen Autor
            </h3>
          </div>
          <div className="flex flex-col gap-4">
            {data.authors.map((a, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center font-black text-sm">
                  {a.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-black text-slate-800">{a.name}</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                    Jumlah Buku:{" "}
                    <span className="text-slate-600">{a.jumlah}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
