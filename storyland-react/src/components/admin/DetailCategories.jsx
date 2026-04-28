import React from "react";
import { getImageUrl } from "../../utils/getImageUrl";
import { HiBookOpen, HiEye, HiChevronRight } from "react-icons/hi";

const DetailCategories = ({ category }) => {
  if (!category) return null;

  return (
    <div className="bg-white rounded-4xl border border-gray-100 shadow-sm p-6 sticky top-6 overflow-y-auto max-h-[calc(100vh-3rem)] custom-scrollbar">
      {/* 1. Top Image Banner */}
      <div className="w-full aspect-4/3 rounded-2xl overflow-hidden bg-[#E6F3FF] mb-6">
        <img
          src={getImageUrl(category.image_banner)}
          alt="Banner"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/600x450?text=No+Banner";
          }}
        />
      </div>

      {/* 2. Title & Subtitle */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          {category.name}
        </h2>
        <p className="text-sm font-medium text-gray-500">
          Status:{" "}
          <span
            className={
              category.status === "active" ? "text-green-500" : "text-red-500"
            }
          >
            {category.status === "active" ? "Aktif" : "Nonaktif"}
          </span>
        </p>
      </div>

      {/* 3. Statistics (Dinamis dari Database) */}
      <div className="space-y-4 mb-8 px-2 bg-gray-50 p-4 rounded-2xl border border-gray-100">
        <div className="flex items-center justify-between text-gray-900 font-bold text-sm md:text-base">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-500 flex items-center justify-center">
              <HiBookOpen className="text-lg" />
            </div>
            Total Buku
          </div>
          <span className="text-lg">{category.total_books}</span>
        </div>

        <div className="flex items-center justify-between text-gray-900 font-bold text-sm md:text-base">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-500 flex items-center justify-center">
              <HiEye className="text-lg" />
            </div>
            Total Dibaca
          </div>
          <span className="text-lg">
            {category.total_views.toLocaleString("id-ID")}
          </span>
        </div>
      </div>

      {/* 4. Deskripsi (Dinamis dari Database) */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-3">Deskripsi</h3>
        <p className="text-sm text-gray-800 leading-relaxed font-medium">
          {category.description || "Tidak ada deskripsi."}
        </p>
      </div>

      {/* 5. Aset Gambar */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-3">Aset Kategori</h3>
        <div className="flex gap-3">
          <div className="w-16 h-16 rounded-xl border border-gray-200 overflow-hidden bg-gray-50 p-1 shrink-0">
            <img
              src={getImageUrl(category.image_icon)}
              alt="Icon"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/100x100?text=Icon";
              }}
            />
          </div>
          <div className="flex-1 aspect-video rounded-xl border border-gray-200 overflow-hidden bg-gray-50">
            <img
              src={getImageUrl(category.image_card)}
              alt="Card"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/400x225?text=Card";
              }}
            />
          </div>
        </div>
      </div>

      {/* 6. Button Pintasan */}
      <button
        className="w-full bg-[#F8AF2F] hover:bg-yellow-500 text-white font-bold py-3.5 rounded-[14px] flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm mt-4"
        onClick={() =>
          alert(
            "Fitur Lihat Lebih Banyak akan diarahkan ke filter tabel Buku nantinya!",
          )
        }
      >
        Lihat lebih banyak <HiChevronRight className="text-xl" />
      </button>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #D1D5DB; }
      `}</style>
    </div>
  );
};

export default DetailCategories;
