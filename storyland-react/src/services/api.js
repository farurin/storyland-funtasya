const BASE_URL = import.meta.env.VITE_API_URL;

// helper global
const fetchAPI = async (endpoint, options = {}, token = null) => {
  const headers = { ...options.headers };

  // OTOMATIS: Jika body adalah string JSON, set header jadi application/json.
  // Jika body adalah FormData (file), JANGAN set Content-Type. Biarkan browser yang mengurusnya (multipart/form-data + boundary).
  if (options.body && typeof options.body === "string") {
    headers["Content-Type"] = "application/json";
  }

  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Sesi habis
  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    alert(
      "Sesi kamu sudah habis. Silakan login kembali untuk melanjutkan petualangan!",
    );
    window.location.href = "/";
    throw new Error("Sesi kedaluwarsa");
  }

  const data = await response.json();

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
