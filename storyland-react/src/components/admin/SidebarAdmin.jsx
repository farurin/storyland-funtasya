import React from "react";
import { NavLink, Link } from "react-router-dom";
import {
  HiChartPie,
  HiBookOpen,
  HiLibrary,
  HiTag,
  HiDatabase,
  HiCog,
  HiUsers,
  HiArrowSmLeft,
} from "react-icons/hi";

import logoFuntasya from "../../assets/logo-funtasya.png";
import { useAuth } from "../../context/AuthContext";

// menu & role yang diizinkan untuk mengaksesnya
const allNavItems = [
  {
    to: "/admin/dashboard",
    icon: HiChartPie,
    label: "Dashboard",
    allowedRoles: ["super_admin", "admin", "editor"],
  },
  {
    to: "/admin/users",
    icon: HiUsers,
    label: "Manajemen Pengguna",
    allowedRoles: ["super_admin"],
  },
  {
    to: "/admin/books",
    icon: HiBookOpen,
    label: "Manajemen Buku",
    allowedRoles: ["super_admin", "admin", "editor"],
  },
  {
    to: "/admin/perpustakaan",
    icon: HiLibrary,
    label: "Perpustakaan",
    allowedRoles: ["super_admin", "admin", "editor"],
  },
  {
    to: "/admin/categories",
    icon: HiTag,
    label: "Kategori & Tag",
    allowedRoles: ["super_admin", "admin"],
  },
  {
    to: "/admin/backup",
    icon: HiDatabase,
    label: "Backup & Ekspor data",
    allowedRoles: ["super_admin", "admin"],
  },
];

export default function SidebarAdmin() {
  const { user } = useAuth();

  // Ambil role user saat ini (fallback ke 'editor' jika undefined agar aman)
  const currentRole = user?.role || "editor";

  // Filter menu berdasarkan role
  const filteredNavItems = allNavItems.filter((item) =>
    item.allowedRoles.includes(currentRole),
  );

  return (
    <aside className="flex flex-col w-56 min-h-screen bg-white border-r border-gray-100 shrink-0 sticky top-0">
      {/* Logo difungsikan sebagai link kembali ke Halaman Publik */}
      <Link
        to="/"
        className="px-4 py-5 border-b border-gray-100 flex flex-col items-center justify-center group hover:bg-gray-50 transition-colors cursor-pointer"
        title="Kembali ke Halaman User"
      >
        <img src={logoFuntasya} alt="Logo Funtasya" className="w-40" />
        <div className="flex items-center gap-1 mt-2 text-[10px] font-bold text-gray-400 group-hover:text-[#6B4EFF] transition-colors">
          <HiArrowSmLeft className="text-sm" /> Lihat Web
        </div>
      </Link>

      {/* Tambah Cerita Baru */}
      <div className="px-4 pt-5 pb-2">
        <NavLink
          to="/admin/tambah"
          className="flex items-center justify-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-3 py-3 hover:bg-amber-100 transition-colors shadow-sm"
        >
          <span className="flex items-center justify-center w-6 h-6 bg-orange-500 rounded-md text-white text-lg font-black leading-none">
            +
          </span>
          <span className="text-sm font-black text-amber-900 leading-tight">
            Tambah Cerita Baru
          </span>
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 flex flex-col gap-1">
        {filteredNavItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 px-5 py-3 text-sm font-semibold border-l-4 transition-all",
                isActive
                  ? "bg-orange-50 text-orange-500 border-orange-500 font-black"
                  : "text-slate-500 border-transparent hover:bg-gray-50 hover:text-slate-700",
              ].join(" ")
            }
          >
            <Icon className="w-5 h-5 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Profile Setting tampil untuk semua role admin */}
      <div className="border-t border-gray-100 py-3">
        <NavLink
          to="/admin/settings"
          className={({ isActive }) =>
            [
              "flex items-center gap-3 px-5 py-3 text-sm font-semibold border-l-4 transition-all",
              isActive
                ? "bg-orange-50 text-orange-500 border-orange-500 font-black"
                : "text-slate-500 border-transparent hover:bg-gray-50 hover:text-slate-700",
            ].join(" ")
          }
        >
          <HiCog className="w-5 h-5 shrink-0" />
          Profile Settings
        </NavLink>
      </div>
    </aside>
  );
}
