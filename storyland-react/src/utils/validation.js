export const validateAuth = (email, password) => {
  const errors = {};

  // Regex (Regular Expression) untuk mengecek format email standar
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validasi Email
  if (!email) {
    errors.email = "Email tidak boleh kosong.";
  } else if (!emailRegex.test(email)) {
    errors.email = "Format email tidak valid.";
  }

  // Validasi Password
  if (!password) {
    errors.password = "Password tidak boleh kosong.";
  } else if (password.length < 8) {
    errors.password = "Password minimal 8 karakter.";
  }

  // isValid bernilai true jika tidak ada error (object errors kosong)
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
