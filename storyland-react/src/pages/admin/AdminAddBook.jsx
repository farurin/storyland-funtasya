import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiMusicNote,
  HiMicrophone,
  HiUpload,
  HiOutlineUpload,
} from "react-icons/hi";
import { getCategories } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const AdminAddBook = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  // State Manajemen Langkah (Step 1, 2, 3)
  const [currentStep, setCurrentStep] = useState(1);
  const [categoryList, setCategoryList] = useState([]);

  // STATE DATA BUKU
  // Step 1
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Step 2
  const [categoryId, setCategoryId] = useState("");
  const [language, setLanguage] = useState("Indonesia");
  const [bgMusic, setBgMusic] = useState(null);
  const [scenes, setScenes] = useState([
    {
      id: 1,
      imageFile: null,
      imagePreview: null,
      dubbingFile: null,
      subtitle: "",
    },
  ]);

  // Step 3
  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  // EFEK: Ambil Data Kategori
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

  // HANDLERS NAVIGASI STEP
  const handleNextToStep2 = (e) => {
    e.preventDefault();
    if (!title || !description) return alert("Harap isi Judul dan Deskripsi!");
    setCurrentStep(2);
  };

  const handleNextToStep3 = () => {
    if (!categoryId) return alert("Harap pilih kategori!");
    if (!scenes[0].imageFile)
      return alert("Harap masukkan minimal 1 gambar untuk Scene 1!");
    setCurrentStep(3);
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // HANDLERS MULTIMEDIA
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
          dubbingFile: null,
          subtitle: "",
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
        dubbingFile: null,
        subtitle: "",
      },
    ]);
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCoverImage(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  // SUBMIT FINAL (Draft / Review)
  const handleSubmitFinal = async (statusBook) => {
    if (!coverImage) return alert("Harap unggah gambar sampul (thumbnail)!");

    console.log("=== DATA BUKU SIAP KIRIM ===");
    console.log("Title:", title);
    console.log("Desc:", description);
    console.log("Kategori ID:", categoryId);
    console.log("Bahasa:", language);
    console.log("Status:", statusBook);
    console.log("Total Scene:", scenes.length);
    console.log("Cover Image:", coverImage.name);

    alert(
      `Data siap dikirim ke backend dengan status: ${statusBook.toUpperCase()}`,
    );
    // Nanti setelah sukses fetch API:
    // navigate("/admin/books");
  };

  return (
    <div className="p-8 md:p-12 w-full flex justify-center items-start min-h-screen bg-gray-50">
      <div className="bg-white w-full max-w-[900px] rounded-[32px] shadow-sm border border-gray-100 p-8 md:p-12 mt-4 relative">
        {/* Tombol Kembali (Muncul di Step 2 & 3) */}
        {currentStep > 1 && (
          <button
            onClick={handleBack}
            className="absolute top-8 left-8 text-gray-400 hover:text-gray-800 font-semibold text-sm cursor-pointer transition-colors"
          >
            ← Kembali
          </button>
        )}

        {/* Header Text (Menyesuaikan Step) */}
        <div className="text-center mb-10 mt-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {currentStep === 3 ? "Tambahkan Sampul" : "Tambahkan Cerita"}
          </h2>
          <p className="text-sm font-medium text-gray-400 max-w-lg mx-auto">
            {currentStep === 3
              ? "Tambahkan sampul atau thumbnail dengan ukuran 1600 x 2560 px atau 5:8."
              : "Tambahkan kontenmu disini dengan mengisi semua kolom jawaban yang ada !"}
          </p>
        </div>

        {/* STEP 1: JUDUL & DESKRIPSI */}
        {currentStep === 1 && (
          <form onSubmit={handleNextToStep2} className="space-y-6">
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
        )}

        {/* STEP 2: MULTIMEDIA & SCENES */}
        {currentStep === 2 && (
          <div className="space-y-8">
            {/* ROW 1: Kategori & Bahasa */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  Pilih Kategori
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-[#F3F4F6] border-none rounded-xl px-5 py-4 text-sm font-medium text-gray-500 outline-none cursor-pointer"
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
                  Pilih Bahasa
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-[#F3F4F6] border-none rounded-xl px-5 py-4 text-sm font-medium text-gray-500 outline-none cursor-pointer"
                >
                  <option value="Indonesia">Indonesia</option>
                  <option value="English">English</option>
                </select>
              </div>
            </div>

            {/* ROW 2: Musik */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">
                Tambahkan Musik
              </label>
              <label className="inline-flex items-center gap-2 bg-[#F64C4C] hover:bg-red-600 text-white font-semibold text-sm px-6 py-3.5 rounded-xl cursor-pointer transition">
                <HiMusicNote className="text-lg" />
                {bgMusic ? bgMusic.name : "Tambahkan Musik"}
                <input
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={(e) => setBgMusic(e.target.files[0])}
                />
              </label>
            </div>

            {/* ROW 3: Jumlah Scene */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">
                Jumlah Scene
              </label>
              <input
                type="number"
                min="1"
                value={scenes.length}
                onChange={handleSceneCountChange}
                className="w-24 bg-[#F3F4F6] border-none rounded-xl px-4 py-3 text-sm font-bold text-gray-700 outline-none text-center"
              />
            </div>

            {/* SCENE LIST */}
            <div className="space-y-12">
              {scenes.map((scene, index) => (
                <div key={index}>
                  <h4 className="text-sm font-extrabold text-gray-900 mb-4">
                    Scene {index + 1}
                  </h4>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-1/2 aspect-4/3 bg-gray-200 rounded-2xl overflow-hidden relative group border border-gray-200">
                      {scene.imagePreview ? (
                        <img
                          src={scene.imagePreview}
                          alt={`Scene ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium">
                          Belum ada gambar
                        </div>
                      )}
                      <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-end pb-6 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <HiUpload className="text-white text-3xl mb-1" />
                        <span className="text-white font-bold text-sm">
                          Ganti File
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
                          <HiUpload /> Upload
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
                    <div className="w-full md:w-1/2 flex flex-col gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                          Tambahkan Dubbing
                        </label>
                        <label className="w-full flex items-center justify-center gap-2 bg-[#C97BFF] hover:bg-purple-500 text-white font-semibold text-sm px-6 py-4 rounded-xl cursor-pointer transition">
                          <HiMicrophone className="text-lg" />
                          {scene.dubbingFile
                            ? scene.dubbingFile.name
                            : "Tambahkan Dubbing"}
                          <input
                            type="file"
                            accept="audio/*"
                            className="hidden"
                            onChange={(e) =>
                              handleSceneDataChange(
                                index,
                                "dubbingFile",
                                e.target.files[0],
                              )
                            }
                          />
                        </label>
                      </div>
                      <div className="flex-1 flex flex-col">
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                          Tambahkan Subtitle
                        </label>
                        <textarea
                          value={scene.subtitle}
                          onChange={(e) =>
                            handleSceneDataChange(
                              index,
                              "subtitle",
                              e.target.value,
                            )
                          }
                          placeholder="Tambahkan Subtitle disini"
                          className="w-full flex-1 bg-[#F3F4F6] border-none focus:bg-white focus:ring-2 focus:ring-yellow-400 rounded-xl px-5 py-4 text-sm font-medium text-gray-700 outline-none resize-none transition-all min-h-25"
                        />
                      </div>
                      {index === scenes.length - 1 && (
                        <button
                          onClick={handleAddOneScene}
                          className="w-full bg-[#FEF0A5] hover:bg-yellow-200 text-amber-800 font-bold text-sm py-4 rounded-xl transition-colors cursor-pointer"
                        >
                          Scene Selanjutnya
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* BUTTON NEXT TO STEP 3 */}
            <div className="pt-10 border-t border-gray-100">
              <button
                onClick={handleNextToStep3}
                className="w-full bg-[#F8AF2F] hover:bg-yellow-500 text-white font-bold text-sm py-4 rounded-xl transition-colors cursor-pointer shadow-sm"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: UPLOAD SAMPUL & FINISH */}
        {currentStep === 3 && (
          <div className="flex flex-col items-center max-w-2xl mx-auto">
            {/* Dashed Upload Box */}
            <label className="w-full aspect-16/10 md:aspect-5/3 border-[3px] border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-yellow-400 hover:bg-yellow-50/30 transition-colors relative overflow-hidden group mb-8">
              {coverPreview ? (
                <>
                  <img
                    src={coverPreview}
                    alt="Cover Preview"
                    className="w-full h-full object-contain bg-gray-50"
                  />
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <HiOutlineUpload className="text-4xl text-white mb-2" />
                    <span className="text-white font-bold">Ganti Sampul</span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center text-gray-400 group-hover:text-yellow-600 transition-colors">
                  <HiOutlineUpload className="text-5xl mb-4" />
                  <span className="text-lg font-bold text-gray-600 group-hover:text-yellow-600 mb-1">
                    Upload Thumbnail
                  </span>
                  <span className="text-sm font-medium">PNG, JPG maks 2MB</span>
                </div>
              )}
              <input
                type="file"
                accept="image/png, image/jpeg"
                className="hidden"
                onChange={handleCoverChange}
              />
            </label>

            {/* Tombol Aksi Akhir */}
            <div className="w-full flex flex-col gap-3">
              <button
                onClick={() => handleSubmitFinal("review")}
                className="w-full bg-[#F8AF2F] hover:bg-yellow-500 text-white font-bold text-sm py-4 rounded-xl transition-colors cursor-pointer shadow-sm"
              >
                Kirim untuk direview
              </button>
              <button
                onClick={() => handleSubmitFinal("draft")}
                className="w-full bg-[#D1D5DB] hover:bg-gray-400 text-gray-700 font-bold text-sm py-4 rounded-xl transition-colors cursor-pointer shadow-sm"
              >
                Simpan ke draft
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAddBook;
