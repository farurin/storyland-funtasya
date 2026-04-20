import React from "react";
import {
  HiUser,
  HiClock,
  HiPencil,
  HiDuplicate,
  HiTrash,
} from "react-icons/hi";
import { LiaBookSolid } from "react-icons/lia";
import { getImageUrl } from "../../utils/getImageUrl";

const CardCategories = ({
  name,
  description,
  image_banner,
  isActive = false,
  onClick,
  onEdit,
  onOpenStatusModal,
  onDelete,
}) => {
  return (
    <div
      onClick={onClick}
      className={`mt-5 flex items-center gap-4 bg-white rounded-2xl p-4 cursor-pointer border ${
        isActive
          ? "border-orange-500"
          : "border-gray-200 hover:border-orange-300"
      }`}
    >
      {/* image */}
      <div className="w-22 h-18 rounded-xl overflow-hidden bg-gray-100">
        <img
          src={getImageUrl(image_banner)} // Menggunakan helper getImageUrl
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* content */}
      <div className="flex-1">
        <h3 className="text-sm font-semibold">{name}</h3>

        <div className="flex gap-4 text-xs text-gray-500 my-1">
          <span className="flex items-center gap-1">
            <LiaBookSolid /> 18 Buku
          </span>
          <span className="flex items-center gap-1">
            <HiUser /> Super Admin
          </span>
          <span className="flex items-center gap-1">
            <HiClock /> 12 Jan 2026
          </span>
        </div>

        <p className="text-xs text-gray-500">{description}</p>
      </div>

      {/* actions */}
      <div className="flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.();
          }}
          className="w-8 h-8 bg-orange-50 text-orange-500 rounded-lg flex items-center justify-center"
        >
          <HiPencil />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenStatusModal?.();
          }}
          className="w-8 h-8 bg-yellow-50 text-yellow-600 rounded-lg flex items-center justify-center"
        >
          <HiDuplicate />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
          className="w-8 h-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center"
        >
          <HiTrash />
        </button>
      </div>
    </div>
  );
};

export default CardCategories;
