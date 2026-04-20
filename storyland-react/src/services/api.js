const BASE_URL = import.meta.env.VITE_API_URL;

// helper global
const fetchAPI = async (endpoint, options = {}, token = null) => {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Sesi habis
  if (response.status === 401) {
    // 1. Hapus token dan data user dari memori
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // 2. Beri tahu pengguna
    alert(
      "Sesi kamu sudah habis. Silakan login kembali untuk melanjutkan petualangan!",
    );

    // 3. Paksa reload dan kembali ke halaman utama
    window.location.href = "/";

    // 4. Hentikan eksekusi kode selanjutnya
    throw new Error("Sesi kedaluwarsa");
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Terjadi kesalahan pada server");
  }

  return data;
};

// authentication
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

// public data (Buku & Kategori)
export const getBooks = () => fetchAPI("/books");
export const getCategories = () => fetchAPI("/categories");
export const getBookPages = (id) => fetchAPI(`/books/${id}/pages`);

// user action (need tokens)
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

// corner
export const getCornerData = (endpoint, token) =>
  fetchAPI(`/corner/${endpoint}`, {}, token);

// user profile & gamification
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

// Admin Routes (Need Token + Admin Role)
export const getAdminCategories = (token) =>
  fetchAPI("/admin/categories", {}, token);

export const createCategory = (data, token) =>
  fetchAPI(
    "/admin/categories",
    { method: "POST", body: JSON.stringify(data) },
    token,
  );

export const updateCategory = (id, data, token) =>
  fetchAPI(
    `/admin/categories/${id}`,
    { method: "PUT", body: JSON.stringify(data) },
    token,
  );

export const updateCategoryStatus = (id, status, token) =>
  fetchAPI(
    `/admin/categories/${id}/status`,
    { method: "PUT", body: JSON.stringify({ status }) },
    token,
  );

export const deleteCategory = (id, token) =>
  fetchAPI(`/admin/categories/${id}`, { method: "DELETE" }, token);
