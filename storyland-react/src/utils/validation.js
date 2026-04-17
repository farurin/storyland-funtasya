// Validasi ketat khusus untuk halaman Register
export const validateRegister = (email, password) => {
  const errors = {};

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Regex Password: Min 8 karakter, 1 huruf besar, 1 huruf kecil, 1 angka, 1 simbol
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!email) {
    errors.email = "*Email tidak boleh kosong.";
  } else if (!emailRegex.test(email)) {
    errors.email = "*Format email tidak valid.";
  }

  if (!password) {
    errors.password = "*Password tidak boleh kosong.";
  } else if (!passwordRegex.test(password)) {
    errors.password =
      "*Password min. 8 karakter, wajib ada huruf besar, kecil, angka, & simbol.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Validasi standar khusus untuk halaman Login (agar akun lama tidak terkunci)
export const validateLogin = (email, password) => {
  const errors = {};

  if (!email) {
    errors.email = "*Email tidak boleh kosong.";
  }
  if (!password) {
    errors.password = "*Password tidak boleh kosong.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
