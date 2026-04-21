import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminAddBook = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleNext = (e) => {
    e.preventDefault();

    // Validasi sederhana
    if (!title || !description) {
      return alert("Harap isi Judul dan Deskripsi terlebih dahulu!");
    }

    // Nanti di sini kita akan menyimpan data sementara ke state/context
    // dan mengarahkan admin ke Step 2 (Upload Cover & Kategori)
    console.log("Data Step 1:", { title, description });
    alert(
      "Data tersimpan sementara! Halaman 'Selanjutnya' (Step 2) akan segera dibuat.",
    );
  };

  return (
    <div className="p-8 md:p-12 w-full flex justify-center items-start min-h-screen bg-gray-50">
      {/* CARD FORM */}
      <div className="bg-white w-full max-w-4xl rounded-4xl shadow-sm border border-gray-100 p-8 md:p-14 mt-4">
        {/* Header Text */}
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Tambahkan Cerita
          </h2>
          <p className="text-sm font-medium text-gray-400">
            Tambahkan kontenmu disini dengan mengisi semua kolom jawaban yang
            ada !
          </p>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleNext} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">
              Judul Cerita
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Judul Konten"
              className="w-full bg-[#F3F4F6] border-2 border-transparent focus:bg-white focus:border-yellow-400 focus:ring-0 rounded-xl px-5 py-4 text-sm font-medium text-gray-700 outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">
              Deskripsi Cerita
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deskripsi atau Sinopsis Konten"
              rows="8"
              className="w-full bg-[#F3F4F6] border-2 border-transparent focus:bg-white focus:border-yellow-400 focus:ring-0 rounded-xl px-5 py-4 text-sm font-medium text-gray-700 outline-none transition-all resize-none"
              required
            />
          </div>

          <div className="pt-6">
            <button
              type="submit"
              className="w-full bg-[#F8AF2F] hover:bg-yellow-500 text-white font-bold text-sm py-4 rounded-xl transition-colors cursor-pointer shadow-sm"
            >
              Selanjutnya
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddBook;
