import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiMusicNote,
  HiMicrophone,
  HiUpload,
  HiOutlineUpload,
  HiX,
} from "react-icons/hi";
import { getCategories, createAdminBook } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useAdminToast } from "../../context/AdminToastContext";

const AdminAddBook = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError, showLoading } = useAdminToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [categoryList, setCategoryList] = useState([]);

  // STEP 1 & BGM
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [bgMusic, setBgMusic] = useState(null);

  // STEP 2: SCENES (Mendukung 2 Bahasa)
  const [scenes, setScenes] = useState([
    {
      id: 1,
      imageFile: null,
      imagePreview: null,
      dubbingIdFile: null,
      subtitleId: "",
      dubbingEnFile: null,
      subtitleEn: "",
    },
  ]);

  // STEP 3
  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await getCategories();
        setCategoryList(res);
      } catch (err) {
        console.error("Gagal mengambil kategori:", err);
      }
    };
    fetchCats();
  }, []);

  // NAVIGASI STEP
  const handleNextToStep2 = (e) => {
    e.preventDefault();
    if (!title || !description)
      return showError("Harap isi Judul dan Deskripsi!");
    setCurrentStep(2);
  };

  const handleNextToStep3 = () => {
    if (!categoryId) return showError("Harap pilih kategori!");
    if (!scenes[0].imageFile)
      return showError("Harap masukkan minimal 1 gambar untuk Scene 1!");
    setCurrentStep(3);
  };

  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  // MULTIMEDIA HANDLERS
  const handleSceneCountChange = (e) => {
    const count = parseInt(e.target.value) || 1;
    if (count < 1) return;

    const newScenes = [...scenes];
    if (count > scenes.length) {
      for (let i = scenes.length; i < count; i++) {
        newScenes.push({
          id: i + 1,
          imageFile: null,
          imagePreview: null,
          dubbingIdFile: null,
          subtitleId: "",
          dubbingEnFile: null,
          subtitleEn: "",
        });
      }
    } else if (count < scenes.length) {
      newScenes.splice(count);
    }
    setScenes(newScenes);
  };

  const handleSceneImageChange = (index, file) => {
    if (!file) return;
    const newScenes = [...scenes];
    newScenes[index].imageFile = file;
    newScenes[index].imagePreview = URL.createObjectURL(file);
    setScenes(newScenes);
  };

  const handleSceneDataChange = (index, field, value) => {
    const newScenes = [...scenes];
    newScenes[index][field] = value;
    setScenes(newScenes);
  };

  const handleAddOneScene = () => {
    setScenes([
      ...scenes,
      {
        id: scenes.length + 1,
        imageFile: null,
        imagePreview: null,
        dubbingIdFile: null,
        subtitleId: "",
        dubbingEnFile: null,
        subtitleEn: "",
      },
    ]);
  };

  const handleRemoveScene = (indexToRemove) => {
    if (scenes.length <= 1) return;
    const updatedScenes = scenes.filter((_, index) => index !== indexToRemove);
    setScenes(updatedScenes);
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCoverImage(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  // SUBMIT KE BACKEND
  const handleSubmitFinal = async (statusBook) => {
    if (!coverImage)
      return showError("Harap unggah gambar sampul (thumbnail)!");

    showLoading(true); // loading overlay
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("id_categories", categoryId);
    formData.append("status", statusBook);

    formData.append("cover_image", coverImage);
    if (bgMusic) formData.append("bg_music", bgMusic);

    const sceneDataForDb = scenes.map((s) => ({
      subtitleId: s.subtitleId,
      subtitleEn: s.subtitleEn,
    }));
    formData.append("scenes", JSON.stringify(sceneDataForDb));

    scenes.forEach((scene, index) => {
      if (scene.imageFile)
        formData.append(`scene_image_${index}`, scene.imageFile);
      if (scene.dubbingIdFile)
        formData.append(`scene_dubbing_id_${index}`, scene.dubbingIdFile);
      if (scene.dubbingEnFile)
        formData.append(`scene_dubbing_en_${index}`, scene.dubbingEnFile);
    });

    try {
      const data = await createAdminBook(formData, token);
      showSuccess(data.message || "Buku berhasil ditambahkan!");
      navigate("/admin/books");
    } catch (err) {
      showError("Terjadi kesalahan: " + err.message);
    } finally {
      showLoading(false); // MATIKAN LOADING
    }
  };

  return (
    <div className="p-8 md:p-12 w-full flex justify-center items-start min-h-screen bg-gray-50">
      <div className="bg-white w-full max-w-5xl rounded-4xl shadow-sm border border-gray-100 p-8 md:p-12 mt-4 relative">
        {currentStep > 1 && (
          <button
            onClick={handleBack}
            className="absolute top-8 left-8 text-gray-400 hover:text-gray-800 font-semibold text-sm cursor-pointer"
          >
            ← Kembali
          </button>
        )}

        <div className="text-center mb-10 mt-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {currentStep === 3 ? "Tambahkan Sampul" : "Tambahkan Cerita"}
          </h2>
          <p className="text-sm font-medium text-gray-400 max-w-lg mx-auto">
            {currentStep === 3
              ? "Tambahkan sampul atau thumbnail dengan ukuran 1600 x 2560 px atau 5:8."
              : "Tambahkan kontenmu disini dengan mengisi semua kolom yang ada !"}
          </p>
        </div>

        {/* STEP 1: INFORMASI DASAR */}
        {currentStep === 1 && (
          <form
            onSubmit={handleNextToStep2}
            className="space-y-6 max-w-3xl mx-auto"
          >
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">
                Judul Cerita
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Judul Konten"
                className="w-full bg-[#F3F4F6] border-2 border-transparent focus:bg-white focus:border-yellow-400 rounded-xl px-5 py-4 text-sm font-medium outline-none"
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
                placeholder="Deskripsi Konten"
                rows="8"
                className="w-full bg-[#F3F4F6] border-2 border-transparent focus:bg-white focus:border-yellow-400 rounded-xl px-5 py-4 text-sm font-medium outline-none resize-none"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#F8AF2F] hover:bg-yellow-500 text-white font-bold py-4 rounded-xl shadow-sm mt-4 cursor-pointer transition-colors"
            >
              Selanjutnya
            </button>
          </form>
        )}

        {/* STEP 2: SCENES (GAMBAR & BILINGUAL) */}
        {currentStep === 2 && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  Pilih Kategori
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-[#F3F4F6] rounded-xl px-5 py-4 text-sm font-medium text-gray-500 outline-none"
                >
                  <option value="" disabled>
                    Pilih Kategori
                  </option>
                  {categoryList.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  Tambahkan Musik Latar
                </label>
                <label className="w-full inline-flex items-center justify-center gap-2 bg-[#F64C4C] hover:bg-red-600 text-white font-semibold text-sm px-6 py-4 rounded-xl cursor-pointer transition-colors">
                  <HiMusicNote className="text-lg" />{" "}
                  {bgMusic ? bgMusic.name : "Upload Musik (Opsional)"}
                  <input
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={(e) => setBgMusic(e.target.files[0])}
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">
                Jumlah Scene
              </label>
              <input
                type="number"
                min="1"
                value={scenes.length}
                onChange={handleSceneCountChange}
                className="w-24 bg-[#F3F4F6] rounded-xl px-4 py-3 text-sm font-bold text-center outline-none"
              />
            </div>

            <div className="space-y-12">
              {scenes.map((scene, index) => (
                <div
                  key={index}
                  className="pt-6 border-t border-gray-100 first:border-0 first:pt-0"
                >
                  {/* HEADER SCENE & TOMBOL HAPUS */}
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-extrabold text-gray-900 bg-gray-100 inline-block px-4 py-1.5 rounded-md">
                      Scene {index + 1}
                    </h4>
                    {scenes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveScene(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 transition cursor-pointer"
                      >
                        <HiX className="text-lg" /> Hapus Scene
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col md:flex-row gap-6">
                    {/* KIRI: UPLOAD GAMBAR */}
                    <div className="w-full md:w-1/3 aspect-4/3 bg-gray-200 rounded-2xl overflow-hidden relative group border border-gray-200 h-fit">
                      {scene.imagePreview ? (
                        <img
                          src={scene.imagePreview}
                          alt={`Scene ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium">
                          No Image
                        </div>
                      )}
                      <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-end pb-6 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <HiUpload className="text-white text-3xl mb-1" />
                        <span className="text-white font-bold text-sm">
                          Ganti Gambar
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleSceneImageChange(index, e.target.files[0])
                          }
                        />
                      </label>
                      {!scene.imagePreview && (
                        <label className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-lg cursor-pointer text-xs font-bold flex items-center gap-2">
                          <HiUpload /> Upload Image
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleSceneImageChange(index, e.target.files[0])
                            }
                          />
                        </label>
                      )}
                    </div>

                    {/* KANAN: DUAL LANGUAGE INPUTS */}
                    <div className="w-full md:w-2/3 flex flex-col gap-6">
                      {/* BAHASA INDONESIA */}
                      <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100">
                        <div className="flex justify-between items-center mb-3">
                          <label className="text-sm font-bold text-orange-900">
                            Versi Indonesia
                          </label>
                          <label className="flex items-center gap-2 bg-[#C97BFF] hover:bg-purple-500 text-white font-semibold text-xs px-4 py-2 rounded-lg cursor-pointer transition-colors">
                            <HiMicrophone />{" "}
                            {scene.dubbingIdFile
                              ? "Audio Terisi"
                              : "Upload Dubbing (ID)"}
                            <input
                              type="file"
                              accept="audio/*"
                              className="hidden"
                              onChange={(e) =>
                                handleSceneDataChange(
                                  index,
                                  "dubbingIdFile",
                                  e.target.files[0],
                                )
                              }
                            />
                          </label>
                        </div>
                        <textarea
                          value={scene.subtitleId}
                          onChange={(e) =>
                            handleSceneDataChange(
                              index,
                              "subtitleId",
                              e.target.value,
                            )
                          }
                          placeholder="Teks subtitle bahasa Indonesia..."
                          className="w-full bg-white border border-gray-200 focus:border-orange-400 rounded-xl px-4 py-3 text-sm outline-none resize-none min-h-20"
                        />
                      </div>

                      {/* BAHASA INGGRIS */}
                      <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                        <div className="flex justify-between items-center mb-3">
                          <label className="text-sm font-bold text-blue-900">
                            Versi Inggris
                          </label>
                          <label className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-xs px-4 py-2 rounded-lg cursor-pointer transition-colors">
                            <HiMicrophone />{" "}
                            {scene.dubbingEnFile
                              ? "Audio Terisi"
                              : "Upload Dubbing (EN)"}
                            <input
                              type="file"
                              accept="audio/*"
                              className="hidden"
                              onChange={(e) =>
                                handleSceneDataChange(
                                  index,
                                  "dubbingEnFile",
                                  e.target.files[0],
                                )
                              }
                            />
                          </label>
                        </div>
                        <textarea
                          value={scene.subtitleEn}
                          onChange={(e) =>
                            handleSceneDataChange(
                              index,
                              "subtitleEn",
                              e.target.value,
                            )
                          }
                          placeholder="Teks subtitle bahasa Inggris..."
                          className="w-full bg-white border border-gray-200 focus:border-blue-400 rounded-xl px-4 py-3 text-sm outline-none resize-none min-h-20"
                        />
                      </div>

                      {/* TOMBOL TAMBAH SCENE DI PALING BAWAH */}
                      {index === scenes.length - 1 && (
                        <button
                          onClick={handleAddOneScene}
                          className="w-full bg-[#FEF0A5] hover:bg-yellow-200 text-amber-800 font-bold text-sm py-3 rounded-xl cursor-pointer transition-colors"
                        >
                          + Tambah Scene Baru
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleNextToStep3}
              className="w-full bg-[#F8AF2F] hover:bg-yellow-500 text-white font-bold py-4 rounded-xl shadow-sm mt-8 cursor-pointer transition-colors"
            >
              Selanjutnya
            </button>
          </div>
        )}

        {/* STEP 3: UPLOAD SAMPUL & FINISH */}
        {currentStep === 3 && (
          <div className="flex flex-col items-center max-w-2xl mx-auto">
            <label className="w-48 md:w-56 aspect-2/3 border-[3px] border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-yellow-400 hover:bg-yellow-50/30 transition-colors relative overflow-hidden group mb-8">
              {coverPreview ? (
                <>
                  <img
                    src={coverPreview}
                    alt="Cover"
                    className="w-full h-full object-cover bg-gray-50"
                  />
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <HiOutlineUpload className="text-3xl text-white mb-2" />
                    <span className="text-white font-bold text-sm">
                      Ganti Sampul
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center text-center p-4 text-gray-400 group-hover:text-yellow-600 transition-colors">
                  <HiOutlineUpload className="text-4xl mb-3" />
                  <span className="text-sm font-bold text-gray-600 group-hover:text-yellow-600 mb-1">
                    Upload Thumbnail
                  </span>
                  <span className="text-[10px] font-medium">
                    PNG, JPG maks 2MB
                  </span>
                </div>
              )}
              <input
                type="file"
                accept="image/png, image/jpeg"
                className="hidden"
                onChange={handleCoverChange}
              />
            </label>

            <div className="w-full flex flex-col gap-3">
              <button
                onClick={() => handleSubmitFinal("review")}
                className="w-full bg-[#F8AF2F] hover:bg-yellow-500 text-white font-bold py-4 rounded-xl shadow-sm cursor-pointer transition-colors"
              >
                Kirim untuk direview
              </button>
              <button
                onClick={() => handleSubmitFinal("arsip")}
                className="w-full bg-[#D1D5DB] hover:bg-gray-400 text-gray-700 font-bold py-4 rounded-xl shadow-sm cursor-pointer transition-colors"
              >
                Simpan ke Arsip
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAddBook;
