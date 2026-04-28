import React, { useState, useEffect } from "react";
import { HiX } from "react-icons/hi";
import { createCategory, updateCategory } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useAdminToast } from "../../context/AdminToastContext";

const AdminCategoryFormModal = ({
  isOpen,
  onClose,
  onSuccess,
  targetCategory,
}) => {
  const { token } = useAuth();
  const { showSuccess, showError, showLoading } = useAdminToast();

  const isEditMode = !!targetCategory;

  // Form States
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [colorHex, setColorHex] = useState("#6B4EFF");

  // File States
  const [imageIcon, setImageIcon] = useState(null);
  const [imageBanner, setImageBanner] = useState(null);
  const [imageCard, setImageCard] = useState(null);

  // Isi data jika mode edit
  useEffect(() => {
    if (isOpen) {
      if (isEditMode) {
        setName(targetCategory.name || "");
        setDescription(targetCategory.description || "");
        setColorHex(targetCategory.color_hex || "#6B4EFF");
      } else {
        setName("");
        setDescription("");
        setColorHex("#6B4EFF");
      }
      setImageIcon(null);
      setImageBanner(null);
      setImageCard(null);
    }
  }, [isOpen, targetCategory, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !description)
      return showError("Nama dan Deskripsi harus diisi!");

    showLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("color_hex", colorHex);
      if (!isEditMode) formData.append("status", "active"); // Default saat create

      if (imageIcon) formData.append("image_icon", imageIcon);
      if (imageBanner) formData.append("image_banner", imageBanner);
      if (imageCard) formData.append("image_card", imageCard);

      if (isEditMode) {
        await updateCategory(targetCategory.id, formData, token);
        showSuccess("Kategori berhasil diperbarui!");
      } else {
        await createCategory(formData, token);
        showSuccess("Kategori baru berhasil ditambahkan!");
      }

      onSuccess(); // Refresh data di komponen induk
      onClose(); // Tutup modal
    } catch (err) {
      showError(err.message);
    } finally {
      showLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-white w-full max-w-125 rounded-2xl p-6 relative">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">
            {isEditMode ? "Edit Kategori" : "Tambah Kategori"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <HiX className="text-2xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 mb-5">
            <div className="flex gap-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 border border-gray-300 rounded-xl p-3 text-sm focus:border-orange-400 focus:ring-1 focus:ring-orange-400 outline-none transition-colors"
                placeholder="Nama Kategori"
                required
              />
              <div
                className="flex items-center justify-center gap-2 border border-gray-300 rounded-xl px-2 shrink-0 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                title="Pilih Warna Tema"
              >
                <input
                  type="color"
                  value={colorHex}
                  onChange={(e) => setColorHex(e.target.value)}
                  className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
                />
              </div>
            </div>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:border-orange-400 focus:ring-1 focus:ring-orange-400 outline-none transition-colors resize-none h-24"
              placeholder="Deskripsi Singkat"
              required
            />
          </div>

          {/* INPUT FILES */}
          <div className="flex flex-col gap-4 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1.5">
                Image Icon (Bulat/Kecil)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageIcon(e.target.files[0])}
                className="text-sm w-full text-slate-500 file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-orange-100 file:text-orange-600 hover:file:bg-orange-200 cursor-pointer transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1.5">
                Image Banner (Landscape/Slider)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageBanner(e.target.files[0])}
                className="text-sm w-full text-slate-500 file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-orange-100 file:text-orange-600 hover:file:bg-orange-200 cursor-pointer transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1.5">
                Image Card (Daftar Kategori)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageCard(e.target.files[0])}
                className="text-sm w-full text-slate-500 file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-orange-100 file:text-orange-600 hover:file:bg-orange-200 cursor-pointer transition-colors"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#F8AF2F] text-white font-bold rounded-xl hover:bg-yellow-500 shadow-sm transition-colors cursor-pointer"
            >
              {isEditMode ? "Simpan Update" : "Tambah Kategori"}
            </button>
          </div>
        </form>
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `.animate-fade-in { animation: fadeIn 0.2s ease-out; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`,
        }}
      />
    </div>
  );
};

export default AdminCategoryFormModal;
