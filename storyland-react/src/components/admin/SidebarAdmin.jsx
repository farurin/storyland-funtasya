import React from "react";
import { NavLink } from "react-router-dom";
import {
  HiChartPie,
  HiBookOpen,
  HiLibrary,
  HiTag,
  HiDatabase,
  HiCog,
  HiUsers,
} from "react-icons/hi";

import logoFuntasya from "../../assets/logo-funtasya.png"; // assets logo
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { to: "/admin/dashboard", icon: HiChartPie, label: "Dashboard" },
  { to: "/admin/books", icon: HiBookOpen, label: "Manajemen Buku" },
  { to: "/admin/perpustakaan", icon: HiLibrary, label: "Perpustakaan" },
  { to: "/admin/categories", icon: HiTag, label: "Kategori & Tag" },
  { to: "/admin/backup", icon: HiDatabase, label: "Backup & Ekspor data" },
];

export default function SidebarAdmin() {
  const { user } = useAuth();

  // Sisipkan menu Manajemen Pengguna setelah Dashboard JIKA user adalah super_admin
  const renderNavItems = () => {
    let finalNavItems = [...navItems];

    // Cek apakah user ada dan rolenya super_admin
    if (user && user.role === "super_admin") {
      finalNavItems.splice(1, 0, {
        // Masukkan di index ke-1 (setelah dashboard)
        to: "/admin/users",
        icon: HiUsers,
        label: "Manajemen Pengguna",
      });
    }

    return finalNavItems;
  };

  return (
    <aside className="flex flex-col w-56 min-h-screen bg-white border-r border-gray-100 shrink-0 sticky top-0">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-gray-100 flex justify-center">
        <img src={logoFuntasya} alt="Logo Funtasya" className="w-40" />
      </div>

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
        {renderNavItems().map(({ to, icon: Icon, label }) => (
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

      {/* Footer */}
      <div className="border-t border-gray-100 py-3">
        <NavLink
          to="/admin/settings"
          className={({ isActive }) =>
            [
              "flex items-center gap-3 px-5 py-3 text-sm font-semibold border-l-4 transition-all",
              isActive
                ? "bg-orange-50 text-orange-500 border-orange-500 font-black"
                : "text-slate-500 border-transparent hover:bg-gray-50",
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
