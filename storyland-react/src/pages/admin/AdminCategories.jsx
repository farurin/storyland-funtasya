import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { HiExclamation } from "react-icons/hi";
import CardCategories from "../../components/admin/CardCategories";
import DetailCategories from "../../components/admin/DetailCategories";
import { getCategories } from "../../services/api";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [isOpen, setIsOpen] = useState(false);

  // status modal
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [targetCategory, setTargetCategory] = useState(null);

  // delete modal
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // form
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("active");

  const [preview, setPreview] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        setCategories(res);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCategories();
  }, []);

  const handleOpenCreate = () => {
    setIsEdit(false);
    setIsOpen(true);
    setName("");
    setDescription("");
    setPreview(null);
    setStatus("active");
  };

  const handleOpenEdit = (cat) => {
    setIsEdit(true);
    setIsOpen(true);

    setName(cat.name);
    setDescription(cat.description);
    setPreview(`/src/assets/category/${cat.image_icon}`);
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
    setPreview(null);
  };

  return (
    <div className="p-16 grid grid-cols-4 gap-4">
      {/* LEFT */}
      <div className="col-span-3">
        <div className="flex items-center gap-3">
          <div className="relative w-full">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              className="border border-gray-300 pl-10 pr-5 py-3 rounded-md w-full"
              placeholder="Search categories or tag"
            />
          </div>

          <button
            onClick={handleOpenCreate}
            className="bg-[#F8AF2F] rounded-md px-5 py-3 text-white"
          >
            Tambah
          </button>
        </div>

        <div className="space-y-3 mt-4">
          {categories.map((cat) => (
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
          ))}
        </div>
      </div>

      {/* RIGHT */}
      <div className="col-span-1">
        <DetailCategories category={selectedCategory} />
      </div>

      {/* MODAL CREATE/EDIT */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[500px] rounded-2xl p-6">
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold">
                {isEdit ? "Edit Kategori" : "Tambah Kategori"}
              </h2>
              <button onClick={handleCloseModal}>✕</button>
            </div>

            <div className="flex gap-3 mb-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-1/2 border rounded-md p-2"
                placeholder="Nama"
              />
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-1/2 border rounded-md p-2"
                placeholder="Deskripsi"
              />
            </div>

            <button className="px-4 py-2 bg-[#F8AF2F] text-white rounded-md">
              {isEdit ? "Update" : "Tambah"}
            </button>
          </div>
        </div>
      )}

      {/* MODAL STATUS (KUNING) */}
      {isStatusOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[420px] rounded-2xl p-6">
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

            <div className="border border-yellow-300 bg-yellow-50 rounded-xl p-4 flex gap-3 mb-4">
              <div className="w-10 h-10 shrink-0 rounded-full bg-yellow-200 flex items-center justify-center">
                <HiExclamation className="text-yellow-700" />
              </div>

              <p className="text-sm text-yellow-800 leading-relaxed">
                18 buku saat ini menggunakan kategori ini. Buku tersebut tetap
                tersedia, tetapi kategori tidak akan ditampilkan.
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsStatusOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-md"
              >
                Batal
              </button>

              <button className="px-4 py-2 bg-[#F8AF2F] text-white rounded-md">
                Ya
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DELETE (MERAH) */}
      {isDeleteOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[420px] rounded-2xl p-6">
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
                18 buku saat ini menggunakan kategori ini. Jika dihapus,
                kategori tidak dapat dikembalikan.
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-md"
              >
                Batal
              </button>

              <button className="px-4 py-2 bg-red-500 text-white rounded-md">
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
