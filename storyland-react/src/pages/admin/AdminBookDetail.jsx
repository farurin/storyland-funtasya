import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  HiMusicNote,
  HiOutlineVolumeUp,
  HiChevronRight,
  HiCheck,
  HiX,
} from "react-icons/hi";

const mockBookDetail = {
  id: 1,
  title: "Malin Kundang",
  author: "Funtasya Team",
  date: "14 Februari 2026",
  category: "Cerita Hewan",
  status: "review",
  cover_image: "https://via.placeholder.com/300x450?text=Malin+Kundang",
  bg_music: true,
  scenes: [
    {
      page_number: 1,
      image: "https://via.placeholder.com/600x400?text=Scene+1",
      text_id:
        "Di sebuah desa kecil di pesisir pantai sumatera, hiduplah seorang ibu dan anaknya bernama Malin Kundang. Ibu Malin adalah seorang janda yang sangat menyayangi anaknya.",
      text_en:
        "In a small village on the coast of Sumatra, lived a mother and her son named Malin Kundang. Malin's mother was a widow who loved her son very much.",
      has_dubbing_id: true,
      has_dubbing_en: true,
    },
    {
      page_number: 2,
      image: "https://via.placeholder.com/600x400?text=Scene+2",
      text_id:
        "Suatu hari Malin berkata, 'Ibu, aku ingin merantau ke kota besar. Aku ingin menjadi orang sukses.' Ibunya sebenarnya berat melepas Malin.",
      text_en:
        "One day Malin said, 'Mother, I want to wander to the big city. I want to be a successful person.' His mother was actually reluctant to let Malin go.",
      has_dubbing_id: true,
      has_dubbing_en: false,
    },
  ],
};

const AdminBookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(mockBookDetail);

  return (
    <div className="p-8 md:p-12 max-w-6xl mx-auto w-full">
      <div className="flex items-center gap-2 text-sm font-bold mb-8">
        <Link
          to="/admin/books"
          className="text-gray-400 hover:text-gray-700 transition"
        >
          Manajemen Buku
        </Link>
        <HiChevronRight className="text-gray-400" />
        <span className="text-orange-500">Detail Cerita ({book.status})</span>
      </div>

      <div className="bg-white w-full rounded-4xl shadow-sm border border-gray-100 p-8">
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <div className="w-full md:w-64 shrink-0 rounded-2xl overflow-hidden shadow-md">
            <img
              src={book.cover_image}
              alt={book.title}
              className="w-full h-auto object-cover aspect-5/8"
            />
          </div>

          <div className="flex-1 min-w-0 flex flex-col justify-between py-2">
            <div>
              <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-4">
                <h1 className="text-3xl font-black text-gray-900 wrap-break-word">
                  {book.title}
                </h1>
                <span
                  className={`shrink-0 px-4 py-1.5 rounded-lg text-sm font-bold uppercase tracking-wider ${
                    book.status === "review"
                      ? "bg-yellow-100 text-yellow-700"
                      : book.status === "terbit"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {book.status}
                </span>
              </div>

              <div className="space-y-3 text-sm font-semibold text-gray-600">
                <p>
                  Diajukan tanggal :{" "}
                  <span className="text-gray-900">{book.date}</span>
                </p>
                <p>
                  Oleh : <span className="text-gray-900">{book.author}</span>
                </p>
                <p>
                  Kategori :{" "}
                  <span className="text-gray-900">{book.category}</span>
                </p>
                <p>
                  Jumlah Scene :{" "}
                  <span className="text-gray-900">
                    {book.scenes.length} Scene
                  </span>
                </p>
              </div>
            </div>

            <div className="mt-6">
              <button className="inline-flex items-center gap-2 bg-[#F64C4C] hover:bg-red-600 text-white font-bold px-6 py-3 rounded-xl transition shadow-sm">
                <HiMusicNote className="text-lg shrink-0" /> Putar Musik Latar
              </button>
            </div>
          </div>
        </div>

        <hr className="border-gray-100 mb-10" />

        <div className="space-y-12">
          {book.scenes.map((scene) => (
            <div
              key={scene.page_number}
              className="flex flex-col lg:flex-row gap-6 min-w-0"
            >
              <div className="w-full lg:w-1/3 shrink-0">
                <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-200 mb-4">
                  <img
                    src={scene.image}
                    alt={`Scene ${scene.page_number}`}
                    className="w-full aspect-4/3 object-cover"
                  />
                </div>
              </div>

              <div className="w-full lg:w-2/3 flex flex-col gap-5 min-w-0">
                <h3 className="text-lg font-black text-gray-900">
                  Scene {scene.page_number}
                </h3>

                {/* Bahasa Indonesia */}
                <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-orange-800 block mb-1">
                        Indonesia:
                      </span>
                      <p className="text-sm font-medium text-gray-700 leading-relaxed wrap-break-word whitespace-pre-wrap">
                        {scene.text_id}
                      </p>
                    </div>
                    <button className="shrink-0 inline-flex items-center justify-center gap-2 bg-[#6B4EFF] hover:bg-indigo-600 text-white font-semibold text-xs px-4 py-2.5 rounded-lg transition w-full sm:w-auto mt-2 sm:mt-0">
                      <HiOutlineVolumeUp className="text-base shrink-0" /> Putar
                      Dubbing
                    </button>
                  </div>
                </div>

                {/* Bahasa Inggris */}
                <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-blue-800 block mb-1">
                        English:
                      </span>
                      <p className="text-sm font-medium text-gray-700 leading-relaxed wrap-break-word whitespace-pre-wrap">
                        {scene.text_en || (
                          <i className="text-gray-400">Belum ada terjemahan</i>
                        )}
                      </p>
                    </div>
                    <button
                      disabled={!scene.has_dubbing_en}
                      className={`shrink-0 inline-flex items-center justify-center gap-2 font-semibold text-xs px-4 py-2.5 rounded-lg transition w-full sm:w-auto mt-2 sm:mt-0 ${
                        scene.has_dubbing_en
                          ? "bg-[#6B4EFF] hover:bg-indigo-600 text-white"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <HiOutlineVolumeUp className="text-base shrink-0" />{" "}
                      {scene.has_dubbing_en ? "Putar Dubbing" : "Audio Kosong"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {book.status === "review" && (
          <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-4">
            <button className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold px-8 py-4 rounded-xl transition cursor-pointer">
              <HiX className="text-xl shrink-0" /> Tolak Cerita
            </button>
            <button className="flex items-center justify-center gap-2 bg-[#F8AF2F] hover:bg-yellow-500 text-white font-bold px-8 py-4 rounded-xl transition cursor-pointer shadow-sm">
              <HiCheck className="text-xl shrink-0" /> Terbitkan Buku
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookDetail;
