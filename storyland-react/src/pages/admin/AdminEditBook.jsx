import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  HiMusicNote,
  HiMicrophone,
  HiUpload,
  HiOutlineUpload,
  HiX,
} from "react-icons/hi";
import {
  getCategories,
  getAdminBookDetail,
  updateAdminBook,
} from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { getImageUrl } from "../../utils/getImageUrl";

const AdminEditBook = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [categoryList, setCategoryList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Merekam data lama jika tidak diubah
  const [existingCover, setExistingCover] = useState(null);
  const [existingBgMusic, setExistingBgMusic] = useState(null);

  // STEP 1 & BGM
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [bgMusic, setBgMusic] = useState(null);

  // STEP 2: SCENES
  const [scenes, setScenes] = useState([]);

  // STEP 3
  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cats = await getCategories();
        setCategoryList(cats);

        // Fetch detail buku untuk pre-fill form
        const bookData = await getAdminBookDetail(id, token);

        setTitle(bookData.title);
        // Anggap backend bisa return description juga di getAdminBookDetail
        setDescription(bookData.description || "Deskripsi buku...");

        // Cari ID kategori dari namanya (karena API getAdminBookDetail saat ini mereturn nama kategori)
        const matchedCat = cats.find((c) => c.name === bookData.category);
        if (matchedCat) setCategoryId(matchedCat.id);

        setExistingCover(bookData.cover_image);
        setCoverPreview(getImageUrl(bookData.cover_image));

        setExistingBgMusic(bookData.bg_music);

        // Format Scenes
        const formattedScenes = bookData.scenes.map((s, index) => ({
          id: index + 1,
          imageFile: null,
          imagePreview: getImageUrl(s.image),
          existingImage: s.image,

          dubbingIdFile: null,
          existingDubbingId: s.dubbing_id_url,
          subtitleId: s.text_id,

          dubbingEnFile: null,
          existingDubbingEn: s.dubbing_en_url,
          subtitleEn: s.text_en,
        }));
        setScenes(formattedScenes);
      } catch (err) {
        alert("Gagal memuat data: " + err.message);
      } finally {
        setIsLoading(false);
      }
    };
    if (token) fetchData();
  }, [id, token]);

  const handleNextToStep2 = (e) => {
    e.preventDefault();
    if (!title) return alert("Harap isi Judul!");
    setCurrentStep(2);
  };

  const handleNextToStep3 = () => {
    if (!categoryId) return alert("Harap pilih kategori!");
    setCurrentStep(3);
  };

  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  // MULTIMEDIA HANDLERS
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
        existingImage: null,
        dubbingIdFile: null,
        subtitleId: "",
        existingDubbingId: null,
        dubbingEnFile: null,
        subtitleEn: "",
        existingDubbingEn: null,
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

  // SUBMIT UPDATE KE BACKEND
  const handleSubmitFinal = async (statusBook) => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("id_categories", categoryId);
    formData.append("status", statusBook);

    // Kirim URL lama jika tidak diubah
    formData.append("existing_cover", existingCover);
    formData.append("existing_bg_music", existingBgMusic || null);

    if (coverImage) formData.append("cover_image", coverImage);
    if (bgMusic) formData.append("bg_music", bgMusic);

    const sceneDataForDb = scenes.map((s) => ({
      subtitleId: s.subtitleId,
      subtitleEn: s.subtitleEn,
      existingImage: s.existingImage,
      existingDubbingId: s.existingDubbingId,
      existingDubbingEn: s.existingDubbingEn,
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
      const data = await updateAdminBook(id, formData, token);
      alert(`Sukses: ${data.message}`);
      navigate(`/admin/books/${id}`);
    } catch (err) {
      alert("Terjadi kesalahan: " + err.message);
    }
  };

  if (isLoading)
    return (
      <div className="p-12 text-center text-gray-500 font-bold">
        Memuat Data Buku...
      </div>
    );

  return (
    <div className="p-8 md:p-12 w-full flex justify-center items-start min-h-screen bg-gray-50">
      <div className="bg-white w-full max-w-5xl rounded-[32px] shadow-sm border border-gray-100 p-8 md:p-12 mt-4 relative">
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
            Update Buku: {title}
          </h2>
          <p className="text-sm font-medium text-gray-400">
            Silakan ubah data yang diperlukan.
          </p>
        </div>

        {/* STEP 1 */}
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
                className="w-full bg-[#F3F4F6] rounded-xl px-5 py-4 text-sm outline-none"
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
                rows="8"
                className="w-full bg-[#F3F4F6] rounded-xl px-5 py-4 text-sm outline-none resize-none"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#F8AF2F] hover:bg-yellow-500 text-white font-bold py-4 rounded-xl mt-4 cursor-pointer"
            >
              Selanjutnya
            </button>
          </form>
        )}

        {/* STEP 2 */}
        {currentStep === 2 && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  Kategori
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-[#F3F4F6] rounded-xl px-5 py-4 text-sm outline-none"
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
                  Ubah Musik Latar
                </label>
                <label className="w-full inline-flex items-center justify-center gap-2 bg-[#F64C4C] hover:bg-red-600 text-white font-semibold text-sm px-6 py-4 rounded-xl cursor-pointer">
                  <HiMusicNote className="text-lg" />{" "}
                  {bgMusic
                    ? bgMusic.name
                    : existingBgMusic
                      ? "Ganti Audio (Sudah Ada)"
                      : "Upload Musik"}
                  <input
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={(e) => setBgMusic(e.target.files[0])}
                  />
                </label>
              </div>
            </div>

            <div className="space-y-12">
              {scenes.map((scene, index) => (
                <div key={index} className="pt-6 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-extrabold text-gray-900 bg-gray-100 inline-block px-4 py-1.5 rounded-md">
                      Scene {index + 1}
                    </h4>
                    {scenes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveScene(index)}
                        className="text-red-500 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <HiX /> Hapus
                      </button>
                    )}
                  </div>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-1/3 aspect-[4/3] bg-gray-200 rounded-2xl overflow-hidden relative group">
                      <img
                        src={scene.imagePreview}
                        alt="Scene"
                        className="w-full h-full object-cover"
                      />
                      <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer">
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
                    </div>

                    <div className="w-full md:w-2/3 flex flex-col gap-6">
                      <div className="bg-orange-50/50 p-4 rounded-2xl">
                        <div className="flex justify-between items-center mb-3">
                          <label className="text-sm font-bold text-orange-900">
                            Versi Indonesia
                          </label>
                          <label className="flex items-center gap-2 bg-[#C97BFF] text-white font-semibold text-xs px-4 py-2 rounded-lg cursor-pointer">
                            <HiMicrophone />{" "}
                            {scene.dubbingIdFile
                              ? "File Baru Terpilih"
                              : scene.existingDubbingId
                                ? "Ganti Audio (Sudah Ada)"
                                : "Upload Audio"}
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
                          className="w-full bg-white rounded-xl px-4 py-3 text-sm min-h-[80px]"
                        />
                      </div>

                      <div className="bg-blue-50/50 p-4 rounded-2xl">
                        <div className="flex justify-between items-center mb-3">
                          <label className="text-sm font-bold text-blue-900">
                            Versi Inggris
                          </label>
                          <label className="flex items-center gap-2 bg-blue-500 text-white font-semibold text-xs px-4 py-2 rounded-lg cursor-pointer">
                            <HiMicrophone />{" "}
                            {scene.dubbingEnFile
                              ? "File Baru Terpilih"
                              : scene.existingDubbingEn
                                ? "Ganti Audio (Sudah Ada)"
                                : "Upload Audio"}
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
                          className="w-full bg-white rounded-xl px-4 py-3 text-sm min-h-[80px]"
                        />
                      </div>

                      {index === scenes.length - 1 && (
                        <button
                          onClick={handleAddOneScene}
                          className="w-full bg-[#FEF0A5] text-amber-800 font-bold py-3 rounded-xl"
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
              className="w-full bg-[#F8AF2F] text-white font-bold py-4 rounded-xl mt-8 cursor-pointer"
            >
              Selanjutnya
            </button>
          </div>
        )}

        {/* STEP 3 */}
        {currentStep === 3 && (
          <div className="flex flex-col items-center max-w-2xl mx-auto">
            <label className="w-full aspect-[16/10] md:aspect-[5/8] border-[3px] border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer group mb-8 overflow-hidden">
              <img
                src={coverPreview}
                alt="Cover"
                className="w-full h-full object-contain"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100">
                <HiOutlineUpload className="text-4xl text-white mb-2" />
                <span className="text-white font-bold">Ganti Sampul</span>
              </div>
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
                className="w-full bg-[#F8AF2F] text-white font-bold py-4 rounded-xl cursor-pointer"
              >
                Update & Kirim untuk direview
              </button>
              <button
                onClick={() => handleSubmitFinal("arsip")}
                className="w-full bg-[#D1D5DB] text-gray-700 font-bold py-4 rounded-xl cursor-pointer"
              >
                Update & Simpan ke Arsip
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEditBook;
