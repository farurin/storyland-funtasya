import React, { useEffect, useState, useCallback } from "react";
import { FiSearch } from "react-icons/fi";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

import CardCategories from "../../components/admin/CardCategories";
import DetailCategories from "../../components/admin/DetailCategories";
import AdminConfirmModal from "../../components/admin/AdminConfirmModal";
import AdminCategoryFormModal from "../../components/admin/AdminCategoryFormModal";
import { useAuth } from "../../context/AuthContext";
import { useAdminToast } from "../../context/AdminToastContext";
import {
  getAdminCategories,
  updateCategoryStatus,
  deleteCategory,
} from "../../services/api";

const AdminCategories = () => {
  const { token } = useAuth();
  const { showSuccess, showError, showLoading } = useAdminToast();

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Atur jumlah kategori per halaman

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [targetCategory, setTargetCategory] = useState(null);

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

  // Reset page to 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Logika Filter & Paginasi
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCategories = filteredCategories.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  // Modal Handlers
  const handleOpenCreate = () => {
    setTargetCategory(null);
    setIsFormOpen(true);
  };
  const handleOpenEdit = (cat) => {
    setTargetCategory(cat);
    setIsFormOpen(true);
  };
  const handleOpenStatusModal = (cat) => {
    setTargetCategory(cat);
    setIsStatusOpen(true);
  };
  const handleOpenDeleteModal = (cat) => {
    setTargetCategory(cat);
    setIsDeleteOpen(true);
  };

  const handleConfirmStatus = async () => {
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
      showLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
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
      showLoading(false);
      setIsDeleteOpen(false);
    }
  };

  return (
    <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-screen bg-gray-50">
      {/* LEFT COLUMN: LIST KATEGORI */}
      <div className="lg:col-span-2 flex flex-col">
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="relative w-full md:w-96">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border-none shadow-sm pl-12 pr-5 py-3.5 rounded-xl w-full text-sm font-medium outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Cari kategori..."
            />
          </div>

          <button
            onClick={handleOpenCreate}
            className="bg-[#F8AF2F] rounded-xl px-6 py-3.5 text-white font-bold hover:bg-yellow-500 shadow-sm transition-colors cursor-pointer w-full md:w-auto shrink-0"
          >
            + Tambah Kategori
          </button>
        </div>

        {/* Paginasi Info */}
        <div className="flex items-center justify-between bg-white px-5 py-3 rounded-xl shadow-sm border border-gray-100 mb-6">
          <span className="font-bold text-gray-500 text-sm">
            {filteredCategories.length > 0 ? startIndex + 1 : 0} -{" "}
            {Math.min(startIndex + itemsPerPage, filteredCategories.length)}{" "}
            dari {filteredCategories.length}
          </span>
          <div className="flex gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="p-1 hover:text-orange-500 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <HiChevronLeft className="text-xl" />
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="p-1 hover:text-orange-500 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <HiChevronRight className="text-xl" />
            </button>
          </div>
        </div>

        {/* Daftar Kategori */}
        <div className="space-y-4 flex-1">
          {paginatedCategories.length > 0 ? (
            paginatedCategories.map((cat) => (
              <CardCategories
                key={cat.id}
                name={cat.name}
                description={cat.description}
                status={cat.status}
                total_books={cat.total_books}
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
            <div className="w-full py-20 flex flex-col items-center justify-center bg-white rounded-3xl border border-gray-100 border-dashed">
              <p className="text-gray-400 font-bold text-lg">
                Kategori tidak ditemukan.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: DETAIL KATEGORI */}
      <div className="lg:col-span-1">
        {selectedCategory ? (
          <DetailCategories category={selectedCategory} />
        ) : (
          <div className="h-full min-h-100 flex items-start justify-center border-2 border-dashed border-gray-200 bg-gray-50 rounded-4xl text-gray-400 font-bold text-sm text-center px-8 pt-20">
            Klik salah satu kategori di samping untuk melihat detail statistik
            dan aset gambarnya.
          </div>
        )}
      </div>

      {/* MODAL FORM COMPONENT */}
      <AdminCategoryFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={fetchCategories}
        targetCategory={targetCategory}
      />

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
