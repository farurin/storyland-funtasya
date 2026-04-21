import { NavLink } from "react-router-dom";
import {
  HiChartPie,
  HiBookOpen,
  HiLibrary,
  HiTag,
  HiDatabase,
  HiCog,
} from "react-icons/hi";

// IMPORT LOGO DARI FOLDER SRC/ASSETS
import logoFuntasya from "../../assets/logo-funtasya.png";

const navItems = [
  { to: "/admin/dashboard", icon: HiChartPie, label: "Dashboard" },
  { to: "/admin/books", icon: HiBookOpen, label: "Manajemen Buku" },
  { to: "/admin/perpustakaan", icon: HiLibrary, label: "Perpustakaan" },
  { to: "/admin/categories", icon: HiTag, label: "Kategori & Tag" },
  { to: "/admin/backup", icon: HiDatabase, label: "Backup & Ekspor data" },
];

export default function SidebarAdmin() {
  return (
    <aside className="flex flex-col w-52 min-h-screen bg-white border-r border-gray-100">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-gray-100">
        {/* PANGGIL VARIABLE LOGO DI SINI */}
        <img src={logoFuntasya} alt="Logo Funtasya" />
      </div>

      {/* Tambah Cerita Baru */}
      <div className="px-3 pt-3">
        <NavLink
          to="/admin/tambah"
          className="flex items-center gap-3 bg-amber-50 border-2 border-amber-300 rounded-xl px-3 py-2.5 hover:bg-amber-100 transition-colors"
        >
          <span className="flex items-center justify-center w-7 h-7 bg-orange-500 rounded-lg text-white text-lg font-black">
            +
          </span>
          <span className="text-xs font-extrabold text-amber-900 leading-tight">
            Tambah Cerita Baru
          </span>
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              [
                "flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold border-l-[3px] transition-all",
                isActive
                  ? "bg-orange-50 text-orange-600 border-orange-500 font-extrabold"
                  : "text-slate-500 border-transparent hover:bg-gray-50 hover:text-slate-700",
              ].join(" ")
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-100 py-2">
        <NavLink
          to="/admin/settings"
          className={({ isActive }) =>
            [
              "flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold border-l-[3px] transition-all",
              isActive
                ? "bg-orange-50 text-orange-600 border-orange-500 font-extrabold"
                : "text-slate-500 border-transparent hover:bg-gray-50",
            ].join(" ")
          }
        >
          <HiCog className="w-4 h-4 shrink-0" />
          Profile Settings
        </NavLink>
      </div>
    </aside>
  );
}
