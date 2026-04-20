import React from "react";
import { LiaBookSolid } from "react-icons/lia";
import { HiEye, HiDownload, HiStar } from "react-icons/hi";

const DetailCategories = ({ category }) => {
  if (!category) {
    return (
      <div className="text-center text-gray-400 mt-10">Pilih kategori dulu</div>
    );
  }

  return (
    <div className="w-[320px] bg-white rounded-2xl shadow-md overflow-hidden">
      {/* image */}
      <div className="w-full h-[200px] bg-gray-200">
        <img
          src={`../src/assets/category/${category.image_banner}`}
          alt={category.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* content */}
      <div className="p-4">
        <h2 className="text-lg font-semibold text-center">{category.name}</h2>

        <p className="text-xs text-gray-500 text-center mb-4">Lorem Ipsum</p>

        {/* stats */}
        <div className="space-y-2 text-sm text-gray-700 mb-4">
          <div className="flex items-center gap-2">
            <LiaBookSolid />
            <span>Total Buku : 18</span>
          </div>

          <div className="flex items-center gap-2">
            <HiEye />
            <span>Total Dibaca : 12.430</span>
          </div>

          <div className="flex items-center gap-2">
            <HiDownload />
            <span>Total Download : 3.210</span>
          </div>

          <div className="flex items-center gap-2">
            <HiStar />
            <span>Rating rata-rata : 4.6</span>
          </div>
        </div>

        {/* deskripsi */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold mb-1">Deskripsi</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            {category.description}
          </p>
        </div>

        {/* buku teratas */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold mb-1">Buku teratas</h3>
          <ol className="text-xs text-gray-700 space-y-1 list-decimal list-inside">
            <li>Maling Kundang : 1412 Kunjungan</li>
            <li>Maling Kundang : 1412 Kunjungan</li>
            <li>Maling Kundang : 1412 Kunjungan</li>
          </ol>
        </div>

        {/* buku aktif */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold mb-1">Buku aktif</h3>
          <ol className="text-xs text-gray-700 space-y-1 list-decimal list-inside">
            <li>Maling Kundang : 1412 Kunjungan</li>
            <li>Maling Kundang : 1412 Kunjungan</li>
            <li>Maling Kundang : 1412 Kunjungan</li>
          </ol>
        </div>

        {/* button */}
        <button className="w-full bg-[#F8AF2F] text-white text-sm py-2 rounded-lg hover:opacity-90 transition">
          Lihat lebih banyak →
        </button>
      </div>
    </div>
  );
};

export default DetailCategories;
