import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { HiExclamation } from "react-icons/hi";
import CardCategories from "../../components/admin/CardCategories";
import DetailCategories from "../../components/admin/DetailCategories";
import { useAuth } from "../../context/AuthContext";
import {
  getAdminCategories,
  createCategory,
  updateCategory,
  updateCategoryStatus,
  deleteCategory,
} from "../../services/api";

const AdminCategories = () => {
  const { token } = useAuth();

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal States
  const [isOpen, setIsOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [targetCategory, setTargetCategory] = useState(null); // Menyimpan ID/Data kategori yang sedang diedit/dihapus

  // Form States
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("active");
  const [isEdit, setIsEdit] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fungsi ambil data (Bisa dipanggil ulang setelah CRUD)
  const fetchCategories = async () => {
    try {
      const res = await getAdminCategories(token);
      setCategories(res);
    } catch (err) {
      console.error(err);
      alert("Gagal memuat kategori: " + err.message);
    }
  };

  useEffect(() => {
    if (token) fetchCategories();
  }, [token]);

  // handler buka modal
  const handleOpenCreate = () => {
    setIsEdit(false);
    setIsOpen(true);
    setTargetCategory(null);
    setName("");
    setDescription("");
    setStatus("active");
  };

  const handleOpenEdit = (cat) => {
    setIsEdit(true);
    setIsOpen(true);
    setTargetCategory(cat); // Simpan data kategori yang mau diedit
    setName(cat.name);
    setDescription(cat.description);
    setStatus(cat.status || "active");
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
    setTargetCategory(null);
  };

  // handler eksekusi crud

  // 1. CREATE & UPDATE
  const handleSubmitForm = async () => {
    if (!name || !description) return alert("Nama dan Deskripsi harus diisi!");

    setIsProcessing(true);
    try {
      if (isEdit) {
        await updateCategory(targetCategory.id, { name, description }, token);
      } else {
        await createCategory({ name, description, status: "active" }, token);
      }
      await fetchCategories(); // Refresh data
      handleCloseModal();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // 2. UBAH STATUS
  const handleConfirmStatus = async () => {
    setIsProcessing(true);
    try {
      const newStatus =
        targetCategory.status === "active" ? "inactive" : "active";
      await updateCategoryStatus(targetCategory.id, newStatus, token);
      await fetchCategories(); // Refresh data
      setIsStatusOpen(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // 3. DELETE
  const handleConfirmDelete = async () => {
    setIsProcessing(true);
    try {
      await deleteCategory(targetCategory.id, token);
      await fetchCategories(); // Refresh data

      // Jika kategori yang dihapus sedang dipilih untuk dilihat detailnya, bersihkan layar kanan
      if (selectedCategory?.id === targetCategory.id) {
        setSelectedCategory(null);
      }

      setIsDeleteOpen(false);
    } catch (err) {
      // Backend akan mengirim error jika kategori ini masih dipakai oleh buku
      alert(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // --- LOGIKA PENCARIAN (CLIENT-SIDE FILTER) ---
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

      {/* MODAL CREATE/EDIT */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-125 rounded-2xl p-6">
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

            <div className="flex gap-3 mb-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-1/2 border rounded-md p-2 focus:ring-2 focus:ring-yellow-400 outline-none"
                placeholder="Nama Kategori"
              />
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-1/2 border rounded-md p-2 focus:ring-2 focus:ring-yellow-400 outline-none"
                placeholder="Deskripsi Singkat"
              />
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

      {/* MODAL STATUS (KUNING) */}
      {isStatusOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-105 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-2">
              {targetCategory?.status === "active"
                ? "Nonaktifkan Kategori?"
                : "Aktifkan Kategori?"}
            </h2>

            <p className="text-sm text-gray-600 mb-4">
              Apakah anda yakin ingin{" "}
              {targetCategory?.status === "active"
                ? "menonaktifkan"
                : "mengaktifkan"}{" "}
              kategori{" "}
              <span className="font-semibold">{targetCategory?.name}</span>?
            </p>

            {targetCategory?.status === "active" && (
              <div className="border border-yellow-300 bg-yellow-50 rounded-xl p-4 flex gap-3 mb-4">
                <div className="w-10 h-10 shrink-0 rounded-full bg-yellow-200 flex items-center justify-center">
                  <HiExclamation className="text-yellow-700" />
                </div>
                <p className="text-sm text-yellow-800 leading-relaxed">
                  Buku yang menggunakan kategori ini tetap tersedia, tetapi
                  kategorinya tidak akan ditampilkan ke pengguna.
                </p>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsStatusOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmStatus}
                disabled={isProcessing}
                className="px-4 py-2 bg-[#F8AF2F] text-white rounded-md cursor-pointer hover:bg-yellow-500 disabled:opacity-50"
              >
                {isProcessing ? "Memproses..." : "Ya, Lanjutkan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DELETE (MERAH) */}
      {isDeleteOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-105 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-2">Hapus Kategori?</h2>

            <p className="text-sm text-gray-600 mb-4">
              Apakah anda yakin ingin menghapus kategori{" "}
              <span className="font-semibold">{targetCategory?.name}</span>?
            </p>

            <div className="border border-red-300 bg-red-50 rounded-xl p-4 flex gap-3 mb-4">
              <div className="w-10 h-10 shrink-0 rounded-full bg-red-200 flex items-center justify-center">
                <HiExclamation className="text-red-700" />
              </div>
              <p className="text-sm text-red-800 leading-relaxed">
                Kategori hanya bisa dihapus jika tidak ada buku yang tertaut.
                Jika dihapus, data tidak dapat dikembalikan.
              </p>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isProcessing}
                className="px-4 py-2 bg-red-500 text-white rounded-md cursor-pointer hover:bg-red-600 disabled:opacity-50"
              >
                {isProcessing ? "Menghapus..." : "Hapus Permanen"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
