import React from "react";
import { Link, useLocation } from "react-router-dom";
import { getImageUrl } from "../utils/getImageUrl";

// Icon svg
const IconClock = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
const IconBookmark = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z" />
  </svg>
);

// fungsi perhitungan waktu (Time Ago)
const timeAgo = (dateString) => {
  if (!dateString) return "Baru saja";

  const date = new Date(dateString);
  const now = new Date();

  const timeDifference = now.getTime() - date.getTime();
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (seconds < 60) return "Baru saja";
  if (minutes < 60) return `${minutes} menit lalu`;
  if (hours < 24) return `${hours} jam lalu`;
  if (days === 1) return "Kemarin";
  if (days < 30) return `${days} hari lalu`;
  if (months < 12) return `${months} bulan lalu`;
  return `${years} tahun lalu`;
};

const SavedCard = ({ book }) => {
  const location = useLocation();
  if (!book) return null;

  // ambil warna kategori, fallback warna ungu default
  const catColor = book.category_color || "#6B4EFF";

  // Ambil data saved_at (dari DB) lalu ubah jadi teks
  const timeSavedText = timeAgo(book.saved_at);

  return (
    <div className="w-full bg-[#EBE9FF] rounded-3xl p-5 flex gap-5 transition-transform hover:scale-[1.02] shadow-sm hover:shadow-md border border-white/50">
      <div className="w-28 md:w-32 shrink-0 aspect-2/3 rounded-2xl overflow-hidden shadow-sm bg-gray-200">
        <img
          src={getImageUrl(book.image)}
          alt={book.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/150x220?text=Cover";
          }}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-3 truncate">
            {book.title}
          </h3>

          <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm font-semibold mb-2">
            <span style={{ color: catColor }}>
              # {book.category_name || "Kategori"}
            </span>
            <span className="text-[#6B4EFF]/40">•</span>
            <span className="text-[#6B4EFF]">
              Dibaca {book.views_count || 0} kali
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm font-medium text-[#6B4EFF]/80">
            <span className="flex items-center gap-1.5">
              <IconClock /> 5min{" "}
            </span>
            <span className="text-[#6B4EFF]/40">•</span>
            <span className="flex items-center gap-1.5">
              <IconBookmark /> Disimpan {timeSavedText}
            </span>
          </div>
        </div>

        <div className="w-full h-px bg-[#6B4EFF]/15 my-3"></div>

        <div className="flex justify-end mt-auto">
          <Link
            to={`${location.pathname}?preview=${book.id}`}
            className="bg-[#6B4EFF] text-white px-7 py-2 rounded-full font-bold text-sm hover:bg-purple-700 transition shadow-md whitespace-nowrap"
          >
            Baca
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SavedCard;
