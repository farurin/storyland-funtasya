import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  HiMusicNote,
  HiOutlineVolumeUp,
  HiChevronRight,
  HiCheck,
  HiX,
  HiPencil,
} from "react-icons/hi";

// IMPORT context & api
import { useAuth } from "../../context/AuthContext";
import { getAdminBookDetail, updateAdminBookStatus } from "../../services/api";
import { getImageUrl } from "../../utils/getImageUrl";

const AdminBookDetail = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  // State data diset null terlebih dahulu
  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // MENGAMBIL DATA DETAIL CERITA DARI BACKEND
  useEffect(() => {
    const fetchDetail = async () => {
      if (!token) return;
      try {
        const data = await getAdminBookDetail(id, token);
        setBook(data);
      } catch (err) {
        alert("Gagal memuat detail cerita: " + err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [id, token]);

  // AKSI MENGUBAH STATUS (TERBIT / DITOLAK / ARSIP / REVIEW)
  const handleUpdateStatus = async (newStatus) => {
    let confirmMsg = `Yakin ingin mengubah status buku ini menjadi ${newStatus.toUpperCase()}?`;

    if (newStatus === "terbit")
      confirmMsg = "Yakin ingin menerbitkan cerita ini ke publik?";
    if (newStatus === "ditolak") confirmMsg = "Yakin ingin menolak cerita ini?";
    if (newStatus === "arsip")
      confirmMsg =
        "Yakin ingin menarik buku ini dari publik dan menyimpannya ke Arsip?";

    if (!window.confirm(confirmMsg)) return;

    try {
      await updateAdminBookStatus(id, newStatus, token);
      alert(
        `Status cerita berhasil diubah menjadi ${newStatus.toUpperCase()}!`,
      );
      navigate("/admin/books"); // kembali ke tabel buku
    } catch (err) {
      alert("Gagal mengubah status: " + err.message);
    }
  };

  // FUNGSI MEMUTAR AUDIO BGM / DUBBING
  const playAudio = (url) => {
    if (!url) return alert("Audio tidak tersedia");
    // Pastikan URL-nya sudah lengkap (ditangani oleh getImageUrl)
    const audio = new Audio(getImageUrl(url));
    audio.play().catch((err) => {
      console.error(err);
      alert("Gagal memutar audio. Pastikan file tersedia.");
    });
  };

  // TAMPILAN SAAT LOADING
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl font-bold text-gray-500 animate-pulse">
          Memuat Detail Cerita...
        </div>
      </div>
    );
  }

  // TAMPILAN JIKA BUKU TIDAK DITEMUKAN ATAU ERROR
  if (!book) {
    return (
      <div className="flex flex-col h-screen items-center justify-center gap-4">
        <div className="text-xl font-bold text-red-500">
          Buku tidak ditemukan!
        </div>
        <button
          onClick={() => navigate("/admin/books")}
          className="px-4 py-2 bg-gray-200 rounded-lg font-bold cursor-pointer"
        >
          Kembali
        </button>
      </div>
    );
  }

  // TAMPILAN UTAMA
  return (
    <div className="p-8 md:p-12 max-w-6xl mx-auto w-full">
      {/* BREADCRUMB */}
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
        {/* HEADER: COVER & METADATA */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          {/* Cover Buku */}
          <div className="w-full md:w-64 shrink-0 rounded-2xl overflow-hidden shadow-md bg-gray-100">
            <img
              src={getImageUrl(book.cover_image)}
              alt={book.title}
              className="w-full h-auto object-cover aspect-5/8"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/300x480?text=No+Cover";
              }}
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
                        : book.status === "ditolak" || book.status === "arsip"
                          ? "bg-red-100 text-red-700"
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
              <button
                onClick={() => playAudio(book.bg_music)}
                className="inline-flex items-center gap-2 bg-[#F64C4C] hover:bg-red-600 text-white font-bold px-6 py-3 rounded-xl transition shadow-sm cursor-pointer"
              >
                <HiMusicNote className="text-lg shrink-0" /> Putar Musik Latar
              </button>
              <Link
                to={`/admin/books/${id}/edit`}
                className="inline-flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold px-6 py-3 rounded-xl transition shadow-sm cursor-pointer"
              >
                <HiPencil className="text-lg shrink-0" /> Edit Buku
              </Link>
            </div>
          </div>
        </div>

        <hr className="border-gray-100 mb-10" />

        {/* DAFTAR SCENE */}
        <div className="space-y-12">
          {book.scenes.map((scene) => (
            <div
              key={scene.page_number}
              className="flex flex-col lg:flex-row gap-6 min-w-0"
            >
              {/* Gambar Scene */}
              <div className="w-full lg:w-1/3 shrink-0">
                <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-200 mb-4 bg-gray-100">
                  <img
                    src={getImageUrl(scene.image)}
                    alt={`Scene ${scene.page_number}`}
                    className="w-full aspect-4/3 object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/600x450?text=No+Image";
                    }}
                  />
                </div>
              </div>

              {/* Teks & Audio Scene */}
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
                    <button
                      onClick={() => playAudio(scene.dubbing_id_url)}
                      disabled={!scene.has_dubbing_id}
                      className={`shrink-0 inline-flex items-center justify-center gap-2 font-semibold text-xs px-4 py-2.5 rounded-lg transition w-full sm:w-auto mt-2 sm:mt-0 cursor-pointer ${
                        scene.has_dubbing_id
                          ? "bg-[#6B4EFF] hover:bg-indigo-600 text-white"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <HiOutlineVolumeUp className="text-base shrink-0" />
                      {scene.has_dubbing_id ? "Putar Dubbing" : "Audio Kosong"}
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
                      onClick={() => playAudio(scene.dubbing_en_url)}
                      disabled={!scene.has_dubbing_en}
                      className={`shrink-0 inline-flex items-center justify-center gap-2 font-semibold text-xs px-4 py-2.5 rounded-lg transition w-full sm:w-auto mt-2 sm:mt-0 cursor-pointer ${
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

        {/* BOTTOM ACTIONS */}
        <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-4">
          {/* Tampil hanya jika status REVIEW */}
          {book.status === "review" && (
            <button
              onClick={() => handleUpdateStatus("ditolak")}
              className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold px-8 py-4 rounded-xl transition cursor-pointer"
            >
              <HiX className="text-xl shrink-0" /> Tolak Cerita
            </button>
          )}

          {/* Tampil jika status REVIEW (Untuk menerbitkan) ATAU status DITOLAK/ARSIP (Untuk ajukan ulang) */}
          {(book.status === "review" ||
            book.status === "arsip" ||
            book.status === "ditolak") && (
            <button
              onClick={() =>
                handleUpdateStatus(
                  book.status === "review" ? "terbit" : "review",
                )
              }
              className="flex items-center justify-center gap-2 bg-[#F8AF2F] hover:bg-yellow-500 text-white font-bold px-8 py-4 rounded-xl transition cursor-pointer shadow-sm"
            >
              <HiCheck className="text-xl shrink-0" />
              {book.status === "review"
                ? "Terbitkan Buku"
                : "Kirim untuk direview"}
            </button>
          )}

          {/* Tampil hanya jika status TERBIT */}
          {book.status === "terbit" && (
            <button
              onClick={() => handleUpdateStatus("arsip")}
              className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold px-8 py-4 rounded-xl transition cursor-pointer"
            >
              Arsipkan Buku Ini
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBookDetail;
