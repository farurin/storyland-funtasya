import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarToggle,
  Button,
} from "flowbite-react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LogoFuntasya from "../assets/logo-funtasya.png";

// icon svg
const IconProfile = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={14}
    height={14}
    viewBox="0 0 14 14"
  >
    <g fill="none" fillRule="evenodd" clipRule="evenodd">
      <path
        fill="#fff"
        d="M1.573 1.573A.25.25 0 0 1 1.75 1.5h1.5a.75.75 0 0 0 0-1.5h-1.5A1.75 1.75 0 0 0 0 1.75v1.5a.75.75 0 0 0 1.5 0v-1.5a.25.25 0 0 1 .073-.177M14 10.75a.75.75 0 0 0-1.5 0v1.5a.25.25 0 0 1-.25.25h-1.5a.75.75 0 0 0 0 1.5h1.5A1.75 1.75 0 0 0 14 12.25zM.75 10a.75.75 0 0 1 .75.75v1.5a.25.25 0 0 0 .25.25h1.5a.75.75 0 0 1 0 1.5h-1.5A1.75 1.75 0 0 1 0 12.25v-1.5A.75.75 0 0 1 .75 10m10-10a.75.75 0 0 0 0 1.5h1.5a.25.25 0 0 1 .25.25v1.5a.75.75 0 0 0 1.5 0v-1.5A1.75 1.75 0 0 0 12.25 0z"
      />
      <path
        fill="#fff7f7"
        d="M9.208 4.46a2.21 2.21 0 1 1-4.421 0a2.21 2.21 0 0 1 4.421 0m-6.353 6.195a4.423 4.423 0 0 1 8.288 0c.112.299-.126.595-.446.595H3.301c-.32 0-.558-.296-.446-.595"
      />
    </g>
  </svg>
);

const IconLanguage = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
  >
    <path
      fill="currentColor"
      d="M8.125 21.213q-1.825-.788-3.187-2.15t-2.15-3.188T2 11.988t.788-3.875t2.15-3.175t3.187-2.15T12.013 2t3.875.788t3.175 2.15t2.15 3.175t.787 3.875t-.787 3.887t-2.15 3.188t-3.175 2.15t-3.875.787t-3.888-.787M12 19.95q.65-.9 1.125-1.875T13.9 16h-3.8q.3 1.1.775 2.075T12 19.95m-2.6-.4q-.45-.825-.787-1.713T8.05 16H5.1q.725 1.25 1.813 2.175T9.4 19.55m5.2 0q1.4-.45 2.488-1.375T18.9 16h-2.95q-.225.95-.562 1.838T14.6 19.55M4.25 14h3.4q-.075-.5-.112-.987T7.5 12t.038-1.012T7.65 10h-3.4q-.125.5-.187.988T4 12t.063 1.013t.187.987m5.4 0h4.7q.075-.5.113-.987T14.5 12t-.038-1.012T14.35 10h-4.7q-.075.5-.112.988T9.5 12t.038 1.013t.112.987m6.7 0h3.4q.125-.5.188-.987T20 12t-.062-1.012T19.75 10h-3.4q.075.5.113.988T16.5 12t-.038 1.013t-.112.987m-.4-6h2.95q-.725-1.25-1.812-2.175T14.6 4.45q.45.825.788 1.713T15.95 8M10.1 8h3.8q-.3-1.1-.775-2.075T12 4.05q-.65.9-1.125 1.875T10.1 8m-5 0h2.95q.225-.95.563-1.838T9.4 4.45Q8 4.9 6.912 5.825T5.1 8"
    />
  </svg>
);

const IconSignUp = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <polyline points="10 17 15 12 10 7" />
    <line x1="15" y1="12" x2="3" y2="12" />
  </svg>
);

// Ikon khusus untuk tombol Admin
const IconAdmin = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const NavItem = ({ to, children }) => (
  <NavLink
    to={to}
    end={to === "/"}
    className={({ isActive }) =>
      `lg:text-[20px] text-base py-2 ${
        isActive
          ? "border-b-2 border-purple-500 text-purple-600 font-semibold"
          : "text-gray-700 hover:text-purple-500"
      }`
    }
  >
    {children}
  </NavLink>
);

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/categories", label: "Categories" },
  { to: "/corner", label: "Corner" },
];

export default function Navigation() {
  // PANGGIL USER DARI AUTH CONTEXT
  const { isLoggedIn, user } = useAuth();

  // CEK APAKAH USER ADALAH ADMIN
  const isAdmin =
    user && ["super_admin", "admin", "editor"].includes(user.role);

  return (
    <Navbar
      fluid
      className="px-3 md:px-20 lg:px-42 shadow-sm sticky top-0 z-100 bg-white/95 backdrop-blur-md w-full"
    >
      <NavbarBrand href="/">
        <img src={LogoFuntasya} alt="Logo Funtasya" className="h-8" />
      </NavbarBrand>

      <div className="flex items-center gap-2 md:order-2">
        {/* JIKA ADMIN, TAMPILKAN TOMBOL DASHBOARD */}
        {isAdmin && (
          <Link
            to="/admin/dashboard"
            className="flex items-center bg-gray-900 hover:bg-black text-white font-bold rounded-full px-5 py-2 md:px-6 md:py-2 gap-2 transition shadow-sm whitespace-nowrap"
          >
            <IconAdmin /> <span className="hidden sm:inline">Panel</span>
          </Link>
        )}

        {isLoggedIn ? (
          // Tombol Profil (Kuning) jika sudah login
          <Link
            to="/profile"
            className="flex items-center bg-[#F59E0B] hover:bg-amber-600 text-white font-bold rounded-full px-5 py-2 md:px-6 md:py-2 gap-2 transition shadow-sm border border-[#F59E0B]/50 whitespace-nowrap"
          >
            <IconProfile /> <span className="hidden sm:inline">Profile</span>
          </Link>
        ) : (
          // Tombol Sign up (Ungu) jika belum login (guest mode)
          <Link
            to="/register"
            className="flex items-center bg-[#6F5CE4] hover:bg-purple-700 text-white font-bold rounded-full px-5 py-2 md:px-6 md:py-2 gap-2 transition shadow-sm whitespace-nowrap"
          >
            <IconSignUp /> <span className="hidden sm:inline">Sign up</span>
          </Link>
        )}

        <Button
          color="blue"
          className="opacity-70 rounded-full px-6 gap-2 hidden lg:flex"
        >
          <IconLanguage /> Indonesia
        </Button>
        <NavbarToggle />
      </div>

      <NavbarCollapse className="md:flex md:items-center bg-white/95 backdrop-blur-md md:bg-transparent">
        {navLinks.map(({ to, label }) => (
          <NavItem key={to} to={to}>
            {label}
          </NavItem>
        ))}
      </NavbarCollapse>
    </Navbar>
  );
}
