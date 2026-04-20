import React, { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import {
  HiBookOpen,
  HiUsers,
  HiGlobe,
  HiEye,
  HiCalendar,
  HiChevronRight,
} from "react-icons/hi";

ChartJS.register(ArcElement, Tooltip, Legend);

// ── DATA ──────────────────────────────────────────────────────────────────────

const statCards = [
  {
    icon: <HiBookOpen className="w-7 h-7 text-orange-500" />,
    iconBg: "bg-orange-100",
    value: "300",
    label: "Total Buku",
  },
  {
    icon: <HiUsers className="w-7 h-7 text-orange-400" />,
    iconBg: "bg-orange-50",
    value: "1,2k",
    label: "Pengguna",
  },
  {
    icon: <HiGlobe className="w-7 h-7 text-orange-500" />,
    iconBg: "bg-orange-100",
    value: "20",
    label: "Bahasa",
  },
  {
    icon: <HiEye className="w-7 h-7 text-amber-500" />,
    iconBg: "bg-amber-50",
    value: "14k",
    label: "Kunjungan",
  },
];

const tabs = ["Paling Populer", "Terbaru", "Download"];

const books = [
  {
    title: "Nelayan dan kendi ajaib",
    author: "Jaka",
    category: "Cerita Nusantara",
    img: "/images/default.jpg",
  },
  {
    title: "Bangau & Monyet yang egois",
    author: "Jaka",
    category: "Cerita Hewan",
    img: "/images/default.jpg",
  },
  {
    title: "Unta yang Malang",
    author: "Jaka",
    category: "Cerita Hewan",
    img: "/images/default.jpg",
  },
  {
    title: "Putri Peri & Pemuda Kayu Ma...",
    author: "Jaka",
    category: "Cerita Hewan",
    img: "/images/default.jpg",
  },
];

const recentBooks = [
  { title: "Nabi Yusuf...", author: "Jaka", img: "/images/default.jpg" },
  { title: "Putri Duyu...", author: "Doni", img: "/images/default.jpg" },
  { title: "Berani Jujur", author: "Cika", img: "/images/default.jpg" },
  { title: "Si Bijak Me...", author: "Raka", img: "/images/default.jpg" },
  { title: "Mulan", author: "Kiput", img: "/images/default.jpg" },
];

const authors = [
  { name: "Cika", jumlah: 40, img: "/images/default.jpg" },
  { name: "Artur", jumlah: 40, img: "/images/default.jpg" },
  { name: "James", jumlah: 40, img: "/images/default.jpg" },
  { name: "Ria", jumlah: 40, img: "/images/default.jpg" },
];

const demography = [
  { label: "Cerita Nusantara", pct: 60, color: "bg-yellow-400" },
  { label: "Cerita Hewan", pct: 50, color: "bg-orange-400" },
  { label: "Cerita Mancanegara", pct: 30, color: "bg-blue-500" },
  { label: "Kisah Nabi & Rasul", pct: 60, color: "bg-blue-700" },
  { label: "Kisah 1001 Malam", pct: 60, color: "bg-purple-500" },
  { label: "Cerita Anak muslim", pct: 60, color: "bg-red-400" },
  { label: "Cerita Anak Tauladan", pct: 40, color: "bg-red-500" },
];

const doughnutData = {
  labels: [
    "Nusantara",
    "Hewan",
    "Mancanegara",
    "Nabi & Rasul",
    "1001 Malam",
    "Muslim",
    "Tauladan",
  ],
  datasets: [
    {
      data: [60, 50, 30, 60, 60, 60, 40],
      backgroundColor: [
        "#FBBF24",
        "#FB923C",
        "#3B82F6",
        "#1D4ED8",
        "#A855F7",
        "#F87171",
        "#EF4444",
      ],
      borderWidth: 3,
      borderColor: "#fff",
    },
  ],
};

const doughnutOptions = {
  cutout: "62%",
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true },
  },
};

// ── COMPONENT ─────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Paling Populer");

  return (
    <div className="flex gap-5 p-5 min-h-screen bg-gray-50">
      {/* ════ LEFT COLUMN ════ */}
      <div className="flex-1 flex flex-col gap-5 min-w-0">
        {/* Stat Cards */}
        <div className="grid grid-cols-4 gap-4">
          {statCards.map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-2xl p-4 flex items-center gap-3 border border-gray-100"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${s.iconBg}`}
              >
                {s.icon}
              </div>
              <div>
                <p className="text-xl font-black text-slate-800 leading-tight">
                  {s.value}
                </p>
                <p className="text-xs text-slate-500 font-semibold">
                  {s.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Status Buku */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <h2 className="text-lg font-black text-slate-800 mb-3">
            Statuts Buku
          </h2>

          {/* Tabs */}
          <div className="flex gap-5 mb-4 border-b border-gray-100">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 text-sm font-bold transition-colors border-b-2 -mb-px ${
                  activeTab === tab
                    ? "border-orange-400 text-orange-500"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Book Grid */}
          <div className="grid grid-cols-4 gap-4">
            {books.map((book, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-gray-100">
                  <img
                    src={book.img}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-800 leading-snug line-clamp-2">
                    {book.title}
                  </p>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">
                    {book.author}
                  </p>
                  <p className="text-xs text-slate-400">{book.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statistik Demography */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <h2 className="text-lg font-black text-slate-800 mb-4">
            Statistik Demography
          </h2>
          <div className="flex gap-8 items-center">
            {/* Bar list */}
            <div className="flex-1 flex flex-col gap-3">
              {demography.map((d) => (
                <div key={d.label} className="flex items-center gap-3">
                  <p className="w-40 text-xs text-slate-600 font-semibold flex-shrink-0">
                    {d.label}
                  </p>
                  <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${d.color}`}
                      style={{ width: `${d.pct}%` }}
                    />
                  </div>
                  <p className="w-10 text-xs font-bold text-slate-600 text-right">
                    {d.pct}%
                  </p>
                </div>
              ))}
            </div>

            {/* Doughnut Chart */}
            <div className="w-52 h-52 flex-shrink-0 relative">
              <Doughnut data={doughnutData} options={doughnutOptions} />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-xs text-slate-500 font-semibold">
                  total buku
                </p>
                <p className="text-2xl font-black text-slate-800">540</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ════ RIGHT COLUMN ════ */}
      <div className="w-56 flex flex-col gap-4 flex-shrink-0">
        {/* User Profile */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <img
              src="/images/default.jpg"
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover bg-gray-100"
            />
            <div className="min-w-0">
              <p className="text-sm font-black text-slate-800 truncate">
                Aji Fahreza
              </p>
              <p className="text-xs text-slate-400 truncate">
                Fahrezaajinr@gmail.com
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <p className="text-xs font-bold text-slate-600">12 Februari 2026</p>
            <HiCalendar className="w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* Manajemen Buku */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 flex-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[12px] font-black text-slate-800">
              Manajemen Buku
            </h3>
            <button className="text-[9px] font-bold text-orange-500 hover:text-orange-600 flex items-center gap-0.5">
              Lihat Semua <HiChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {recentBooks.map((b, i) => (
              <div key={i} className="flex items-center gap-3">
                <img
                  src={b.img}
                  alt={b.title}
                  className="w-10 h-12 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">
                    {b.title}
                  </p>
                  <p className="text-xs text-slate-400">{b.author}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Manajemen Autor */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[12px] font-black text-slate-800">
              Manajemen Autor
            </h3>
            <button className="text-[8px] font-bold text-orange-500 hover:text-orange-600 flex items-center gap-0.5">
              Lihat Semua <HiChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {authors.map((a, i) => (
              <div key={i} className="flex items-center gap-3">
                <img
                  src={a.img}
                  alt={a.name}
                  className="w-9 h-9 rounded-full object-cover bg-gray-100 flex-shrink-0"
                />
                <div>
                  <p className="text-xs font-bold text-slate-800">{a.name}</p>
                  <p className="text-xs text-slate-400">
                    Jumlah Buku : {a.jumlah}
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
