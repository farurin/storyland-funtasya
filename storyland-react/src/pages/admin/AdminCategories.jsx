import React, { useEffect, useState, useCallback } from "react";
import { FiSearch } from "react-icons/fi";
import CardCategories from "../../components/admin/CardCategories";
import DetailCategories from "../../components/admin/DetailCategories";
import AdminConfirmModal from "../../components/admin/AdminConfirmModal";
import { useAuth } from "../../context/AuthContext";
import { useAdminToast } from "../../context/AdminToastContext";
import {
  getAdminCategories,
  createCategory,
  updateCategory,
  updateCategoryStatus,
  deleteCategory,
} from "../../services/api";

const AdminCategories = () => {
  const { token } = useAuth();
  const { showSuccess, showError, showLoading } = useAdminToast();

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [isOpen, setIsOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [targetCategory, setTargetCategory] = useState(null);

  // Form States
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("active");
  const [colorHex, setColorHex] = useState("#6B4EFF");
  const [isEdit, setIsEdit] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form Files
  const [imageIcon, setImageIcon] = useState(null);
  const [imageBanner, setImageBanner] = useState(null);
  const [imageCard, setImageCard] = useState(null);

  const fetchCategories = useCallback(async () => {
    if (!token) return;
    try {
      const res = await getAdminCategories(token);
      setCategories(res);
    } catch (err) {
      showError("Gagal memuat kategori: " + err.message);
    }
  }, [token, showError]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleOpenCreate = () => {
    setIsEdit(false);
    setIsOpen(true);
    setTargetCategory(null);
    setName("");
    setDescription("");
    setStatus("active");
    setColorHex("#6B4EFF");
    setImageIcon(null);
    setImageBanner(null);
    setImageCard(null);
  };

  const handleOpenEdit = (cat) => {
    setIsEdit(true);
    setIsOpen(true);
    setTargetCategory(cat);
    setName(cat.name);
    setDescription(cat.description);
    setStatus(cat.status || "active");
    setColorHex(cat.color_hex || "#6B4EFF");
    setImageIcon(null);
    setImageBanner(null);
    setImageCard(null);
  };

  const handleOpenStatusModal = (cat) => {
    setTargetCategory(cat);
    setIsStatusOpen(true);
  };

  const handleOpenDeleteModal = (cat) => {
    setTargetCategory(cat);
    setIsDeleteOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setIsEdit(false);
    setName("");
    setDescription("");
    setColorHex("#6B4EFF");
    setTargetCategory(null);
    setImageIcon(null);
    setImageBanner(null);
    setImageCard(null);
  };

  const handleSubmitForm = async () => {
    if (!name || !description)
      return showError("Nama dan Deskripsi harus diisi!");

    setIsProcessing(true);
    showLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("color_hex", colorHex);
      if (!isEdit) formData.append("status", "active");

      if (imageIcon) formData.append("image_icon", imageIcon);
      if (imageBanner) formData.append("image_banner", imageBanner);
      if (imageCard) formData.append("image_card", imageCard);

      if (isEdit) {
        await updateCategory(targetCategory.id, formData, token);
        showSuccess("Kategori berhasil diperbarui!");
      } else {
        await createCategory(formData, token);
        showSuccess("Kategori baru berhasil ditambahkan!");
      }

      await fetchCategories();
      handleCloseModal();
    } catch (err) {
      showError(err.message);
    } finally {
      setIsProcessing(false);
      showLoading(false);
    }
  };

  const handleConfirmStatus = async () => {
    setIsProcessing(true);
    showLoading(true);
    try {
      const newStatus =
        targetCategory.status === "active" ? "inactive" : "active";
      await updateCategoryStatus(targetCategory.id, newStatus, token);
      await fetchCategories();
      setIsStatusOpen(false);
      showSuccess(
        `Status kategori berhasil diubah menjadi ${newStatus === "active" ? "Aktif" : "Non Aktif"}.`,
      );
    } catch (err) {
      showError(err.message);
    } finally {
      setIsProcessing(false);
      showLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    setIsProcessing(true);
    showLoading(true);
    try {
      await deleteCategory(targetCategory.id, token);
      await fetchCategories();

      if (selectedCategory?.id === targetCategory.id) {
        setSelectedCategory(null);
      }
      setIsDeleteOpen(false);
      showSuccess("Kategori berhasil dihapus secara permanen!");
    } catch (err) {
      showError(err.message);
    } finally {
      setIsProcessing(false);
      showLoading(false);
      setIsDeleteOpen(false);
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="p-16 grid grid-cols-4 gap-4">
      {/* LEFT */}
      <div className="col-span-3">
        <div className="flex items-center gap-3">
          <div className="relative w-full">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 pl-10 pr-5 py-3 rounded-md w-full"
              placeholder="Search categories or tag"
            />
          </div>

          <button
            onClick={handleOpenCreate}
            className="bg-[#F8AF2F] rounded-md px-5 py-3 text-white hover:bg-yellow-500 transition cursor-pointer"
          >
            Tambah
          </button>
        </div>

        <div className="space-y-3 mt-4">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((cat) => (
              <CardCategories
                key={cat.id}
                name={cat.name}
                description={cat.description}
                status={cat.status}
                image_icon={cat.image_icon}
                image_card={cat.image_card}
                image_banner={cat.image_banner}
                isActive={selectedCategory?.id === cat.id}
                onClick={() => setSelectedCategory(cat)}
                onEdit={() => handleOpenEdit(cat)}
                onOpenStatusModal={() => handleOpenStatusModal(cat)}
                onDelete={() => handleOpenDeleteModal(cat)}
              />
            ))
          ) : (
            <p className="text-gray-500 text-center py-10">
              Tidak ada kategori ditemukan.
            </p>
          )}
        </div>
      </div>

      {/* RIGHT */}
      <div className="col-span-1">
        {selectedCategory ? (
          <DetailCategories category={selectedCategory} />
        ) : (
          <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl text-gray-400">
            Pilih kategori untuk melihat detail
          </div>
        )}
      </div>

      {/* MODAL CREATE/EDIT FORM */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-125 max-w-[90vw] rounded-2xl p-6">
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold">
                {isEdit ? "Edit Kategori" : "Tambah Kategori"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-black cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-3 mb-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 border rounded-md p-2 focus:ring-2 focus:ring-yellow-400 outline-none"
                  placeholder="Nama Kategori"
                />
                <div
                  className="flex items-center gap-2 border rounded-md px-2 shrink-0 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
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
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-yellow-400 outline-none"
                placeholder="Deskripsi Singkat"
              />
            </div>

            {/* INPUT FILES */}
            <div className="flex flex-col gap-3 mb-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">
                  Image Icon (Bulat/Kecil)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageIcon(e.target.files[0])}
                  className="text-sm w-full text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100 cursor-pointer"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">
                  Image Banner (Landscape/Slider)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageBanner(e.target.files[0])}
                  className="text-sm w-full text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100 cursor-pointer"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">
                  Image Card (Daftar Kategori)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageCard(e.target.files[0])}
                  className="text-sm w-full text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300"
              >
                Batal
              </button>
              <button
                onClick={handleSubmitForm}
                disabled={isProcessing}
                className="px-4 py-2 bg-[#F8AF2F] text-white rounded-md cursor-pointer hover:bg-yellow-500 disabled:opacity-50"
              >
                {isProcessing ? "Menyimpan..." : isEdit ? "Update" : "Tambah"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL STATUS COMPONENT */}
      <AdminConfirmModal
        isOpen={isStatusOpen}
        onClose={() => setIsStatusOpen(false)}
        onConfirm={handleConfirmStatus}
        title={
          targetCategory?.status === "active"
            ? "Nonaktifkan Kategori?"
            : "Aktifkan Kategori?"
        }
        description={`Apakah anda yakin ingin ${targetCategory?.status === "active" ? "menonaktifkan" : "mengaktifkan"} kategori "${targetCategory?.name}"?`}
        warningText={
          targetCategory?.status === "active"
            ? "Buku yang menggunakan kategori ini tetap tersedia, tetapi kategorinya tidak akan ditampilkan ke pengguna."
            : null
        }
        variant="primary"
        confirmText="Ya, Lanjutkan"
      />

      {/* MODAL DELETE COMPONENT */}
      <AdminConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Kategori?"
        description={`Apakah anda yakin ingin menghapus kategori "${targetCategory?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        warningText="Kategori hanya bisa dihapus jika tidak ada buku yang tertaut. Jika dihapus, data tidak dapat dikembalikan."
        variant="danger"
        confirmText="Hapus Permanen"
      />
    </div>
  );
};

export default AdminCategories;
