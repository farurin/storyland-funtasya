const BASE_URL = import.meta.env.VITE_API_URL;

// helper global
const fetchAPI = async (endpoint, options = {}, token = null) => {
  const headers = { ...options.headers };

  // OTOMATIS: Jika body adalah string JSON, set header jadi application/json.
  if (options.body && typeof options.body === "string") {
    headers["Content-Type"] = "application/json";
  }

  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // BACA DATA JSON DI AWAL AGAR BISA CEK ISI PESANNYA
  let data;
  try {
    data = await response.json();
  } catch (err) {
    // Fallback jika response backend bukan JSON (misal error HTML 500)
    data = { message: "Terjadi kesalahan pada server" };
  }

  // DETEKSI SESI HABIS:
  const isSessionExpired =
    response.status === 401 ||
    (response.status === 400 &&
      data.message &&
      data.message.toLowerCase().includes("token"));

  if (isSessionExpired) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    if (!window.isSessionAlertShown) {
      window.isSessionAlertShown = true;
      alert("Sesi kamu sudah habis. Silakan login kembali untuk melanjutkan petualangan!");
      window.location.href = "/"; // redirect home
    }
    
    // Hentikan eksekusi kode selanjutnya
    throw new Error("Sesi kedaluwarsa");
  }

  // Handle error umum lainnya
  if (!response.ok) {
    throw new Error(data.message || "Terjadi kesalahan pada server");
  }

  return data;
};

// AUTHENTICATION
export const loginUser = (credentials) =>
  fetchAPI("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
export const registerUser = (credentials) =>
  fetchAPI("/auth/register", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

// PUBLIC DATA (Buku & Kategori)
export const getBooks = () => fetchAPI("/books");
export const getCategories = () => fetchAPI("/categories");
export const getBookPages = (id) => fetchAPI(`/books/${id}/pages`);

// USER ACTIONS (Need Tokens)
export const finishBook = (id, token) =>
  fetchAPI(`/books/${id}/finish`, { method: "POST" }, token);
export const updateProgress = (id, progress, token) =>
  fetchAPI(
    `/books/${id}/progress`,
    { method: "POST", body: JSON.stringify({ progress }) },
    token,
  );
export const getBookStatus = (id, token) =>
  fetchAPI(`/books/${id}/status`, {}, token);
export const toggleFavorite = (id, token) =>
  fetchAPI(`/books/${id}/favorite`, { method: "POST" }, token);
export const toggleSave = (id, token) =>
  fetchAPI(`/books/${id}/save`, { method: "POST" }, token);

// CORNER
export const getCornerData = (endpoint, token) =>
  fetchAPI(`/corner/${endpoint}`, {}, token);

// USER PROFILE & GAMIFICATION
export const getUserProfile = (token) => fetchAPI("/user/profile", {}, token);
export const updateUserProfile = (data, token) =>
  fetchAPI(
    "/user/profile",
    { method: "PUT", body: JSON.stringify(data) },
    token,
  );
export const getAvatars = (token) => fetchAPI("/user/avatars", {}, token);
export const getCharacters = (token) => fetchAPI("/user/characters", {}, token);
export const updateActiveCharacter = (characterId, token) =>
  fetchAPI(
    "/user/characters/active",
    { method: "PUT", body: JSON.stringify({ characterId }) },
    token,
  );
export const getLeaderboard = (token) =>
  fetchAPI("/user/leaderboard", {}, token);
export const getMissions = (token) => fetchAPI("/user/missions", {}, token);
export const claimMission = (id, token) =>
  fetchAPI(`/user/missions/${id}/claim`, { method: "POST" }, token);

// ADMIN ROUTES (Need Token + Admin Role)
export const getAdminCategories = (token) =>
  fetchAPI("/admin/categories", {}, token);

export const createCategory = (formData, token) =>
  fetchAPI("/admin/categories", { method: "POST", body: formData }, token);

export const updateCategory = (id, formData, token) =>
  fetchAPI(`/admin/categories/${id}`, { method: "PUT", body: formData }, token);

export const updateCategoryStatus = (id, status, token) =>
  fetchAPI(
    `/admin/categories/${id}/status`,
    { method: "PUT", body: JSON.stringify({ status }) },
    token,
  );

export const deleteCategory = (id, token) =>
  fetchAPI(`/admin/categories/${id}`, { method: "DELETE" }, token);

export const getAdminBooks = (token) => fetchAPI("/admin/books", {}, token);

// tambah buku admin
export const createAdminBook = (formData, token) =>
  fetchAPI("/admin/books", { method: "POST", body: formData }, token);

export const getAdminBookDetail = (id, token) =>
  fetchAPI(`/admin/books/${id}`, {}, token);

export const updateAdminBookStatus = (id, status, token) =>
  fetchAPI(
    `/admin/books/${id}/status`,
    { method: "PUT", body: JSON.stringify({ status }) },
    token,
  );

export const updateAdminBook = (id, formData, token) =>
  fetchAPI(`/admin/books/${id}`, { method: "PUT", body: formData }, token);

export const getAdminProfile = (token) => fetchAPI("/admin/profile", {}, token);
export const updateAdminProfile = (formData, token) =>
  fetchAPI("/admin/profile", { method: "PUT", body: formData }, token);
export const updateAdminPassword = (data, token) =>
  fetchAPI(
    "/admin/profile/password",
    { method: "PUT", body: JSON.stringify(data) },
    token,
  );

export const getAdminDashboardStats = (token) =>
  fetchAPI("/admin/dashboard", {}, token);

// Manajemen Pengguna Admin
export const getAdminUsers = (token) => fetchAPI("/admin/users", {}, token);
