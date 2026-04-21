import React from "react";
import {
  HiUser,
  HiClock,
  HiPencil,
  HiTrash,
  HiEye,
  HiEyeOff,
} from "react-icons/hi";
import { LiaBookSolid } from "react-icons/lia";
import { getImageUrl } from "../../utils/getImageUrl";

const CardCategories = ({
  name,
  description,
  image_banner,
  status, // Mengambil status
  isActive = false,
  onClick,
  onEdit,
  onOpenStatusModal,
  onDelete,
}) => {
  return (
    <div
      onClick={onClick}
      className={`mt-5 flex items-center gap-4 bg-white rounded-2xl p-4 cursor-pointer border transition-all ${
        isActive
          ? "border-orange-500 shadow-md ring-2 ring-orange-100"
          : "border-gray-200 hover:border-orange-300 hover:shadow-sm"
      } ${status === "inactive" ? "opacity-75 bg-gray-50" : ""}`}
    >
      {/* image */}
      <div className="w-24 h-16 md:w-28 md:h-20 shrink-0 rounded-xl overflow-hidden bg-gray-100 relative">
        <img
          src={getImageUrl(image_banner)}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/150x100?text=Banner";
          }}
        />
        {/* Label Overlay Inactive (Bisa dihapus jika dirasa berlebihan karena sudah ada badge di bawah) */}
        {status === "inactive" && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white text-[10px] font-bold px-2 py-1 bg-red-500 rounded-md shadow-sm">
              Tersembunyi
            </span>
          </div>
        )}
      </div>

      {/* content */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-bold text-gray-900 truncate">{name}</h3>

        {/* Informasi Kategori & Badge Status */}
        <div className="flex gap-3 md:gap-4 text-[10px] md:text-xs text-gray-500 my-1.5 flex-wrap items-center">
          <span className="flex items-center gap-1 whitespace-nowrap">
            <LiaBookSolid className="text-orange-500 text-sm" /> ? Buku
          </span>
          <span className="flex items-center gap-1 whitespace-nowrap">
            <HiUser className="text-orange-500 text-sm" /> Admin
          </span>
          <span className="flex items-center gap-1 whitespace-nowrap">
            <HiClock className="text-orange-500 text-sm" /> Baru saja
          </span>

          {/* Badge Status Aktif/Nonaktif */}
          <span
            className={`px-2 py-0.5 rounded-md font-bold text-[9px] uppercase tracking-wider ${
              status === "active"
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            {status === "active" ? "Aktif" : "Nonaktif"}
          </span>
        </div>

        <p className="text-xs text-gray-500 line-clamp-1">{description}</p>
      </div>

      {/* actions */}
      <div className="flex gap-1.5 shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.();
          }}
          title="Edit"
          className="w-8 h-8 bg-orange-50 text-orange-500 rounded-lg flex items-center justify-center hover:bg-orange-100 transition shadow-sm"
        >
          <HiPencil />
        </button>

        {/* Tombol Toggle Status (Mata) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenStatusModal?.();
          }}
          title={
            status === "active" ? "Nonaktifkan Kategori" : "Aktifkan Kategori"
          }
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition shadow-sm ${
            status === "active"
              ? "bg-gray-100 text-gray-500 hover:bg-gray-200" // Saat aktif, tombol ini untuk menonaktifkan
              : "bg-green-50 text-green-600 hover:bg-green-100" // Saat nonaktif, tombol ini untuk mengaktifkan
          }`}
        >
          {status === "active" ? <HiEyeOff /> : <HiEye />}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
          title="Hapus"
          className="w-8 h-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-100 transition shadow-sm"
        >
          <HiTrash />
        </button>
      </div>
    </div>
  );
};

export default CardCategories;
