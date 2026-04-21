import React from "react";
import { getImageUrl } from "../../utils/getImageUrl";
import {
  HiBookOpen,
  HiEye,
  HiDownload,
  HiStar,
  HiChevronRight,
} from "react-icons/hi";

const DetailCategories = ({ category }) => {
  // Jika tidak ada kategori yang dipilih, tampilkan placeholder
  if (!category) return null;

  return (
    <div className="bg-white rounded-4xl border border-gray-100 shadow-sm p-6 sticky top-6 overflow-y-auto max-h-[calc(100vh-3rem)] custom-scrollbar">
      {/* 1. Top Image Banner */}
      <div className="w-full aspect-4/3 rounded-2xl overflow-hidden bg-[#E6F3FF] mb-6">
        <img
          src={getImageUrl(category.image_banner)}
          alt="Banner"
          className="w-full h-full object-cover"
          onError={(e) =>
            (e.target.src =
              "https://via.placeholder.com/600x450?text=No+Banner")
          }
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

      {/* 3. Statistics (Statis - Sesuai Figma) */}
      <div className="space-y-3.5 mb-8 px-2">
        <div className="flex items-center gap-4 text-gray-900 font-bold text-sm md:text-base">
          <HiBookOpen className="text-xl shrink-0" /> Total Buku : 18
        </div>
        <div className="flex items-center gap-4 text-gray-900 font-bold text-sm md:text-base">
          <HiEye className="text-xl shrink-0" /> Total Dibaca : 12.430
        </div>
        <div className="flex items-center gap-4 text-gray-900 font-bold text-sm md:text-base">
          <HiDownload className="text-xl shrink-0" /> Total Download : 3.210
        </div>
        <div className="flex items-center gap-4 text-gray-900 font-bold text-sm md:text-base">
          <HiStar className="text-xl shrink-0" /> Rating rata-rata : 4.6
        </div>
      </div>

      {/* 4. Deskripsi (Dinamis dari Database) */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-3">Deskripsi</h3>
        <p className="text-sm text-gray-800 leading-relaxed font-medium">
          {category.description ||
            "Kategori ini berisi cerita bertema hewan yang menghadirkan kisah edukatif dan hiburan untuk anak dan remaja."}
        </p>
      </div>

      {/* 5. Aset Gambar (Menampilkan sisa 2 gambar lainnya) */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-3">Aset Kategori</h3>
        <div className="flex gap-3">
          <div className="w-16 h-16 rounded-xl border border-gray-200 overflow-hidden bg-gray-50 p-1 shrink-0">
            <img
              src={getImageUrl(category.image_icon)}
              alt="Icon"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex-1 aspect-video rounded-xl border border-gray-200 overflow-hidden bg-gray-50">
            <img
              src={getImageUrl(category.image_card)}
              alt="Card"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* 6. Buku Teratas (Statis - Sesuai Figma) */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-3">Buku teratas</h3>
        <ol className="list-decimal list-inside text-sm text-gray-800 space-y-2 font-medium">
          <li>Maling Kundang : 1412 Kunjungan</li>
          <li>Maling Kundang : 1412 Kunjungan</li>
          <li>Maling Kundang : 1412 Kunjungan</li>
        </ol>
      </div>

      {/* 7. Buku Aktif (Statis - Sesuai Figma) */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-3">Buku aktif</h3>
        <ol className="list-decimal list-inside text-sm text-gray-800 space-y-2 font-medium">
          <li>Maling Kundang : 1412 Kunjungan</li>
          <li>Maling Kundang : 1412 Kunjungan</li>
          <li>Maling Kundang : 1412 Kunjungan</li>
        </ol>
      </div>

      {/* 8. Button */}
      <button
        className="w-full bg-[#F8AF2F] hover:bg-yellow-500 text-white font-bold py-3.5 rounded-[14px] flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
        onClick={() =>
          alert(
            "Fitur Lihat Lebih Banyak akan diarahkan ke filter tabel Buku nantinya!",
          )
        }
      >
        Lihat lebih banyak <HiChevronRight className="text-xl" />
      </button>

      {/* CSS Scrollbar khusus kalau isinya panjang */}
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
