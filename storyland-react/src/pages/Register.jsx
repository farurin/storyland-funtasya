import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import AuthLayout, {
  IconEye,
  IconEyeOff,
  IconGoogle,
  IconFacebook,
} from "../components/AuthLayout";
import { validateAuth } from "../utils/validation";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Cek field kosong
    if (!email || !password) {
      setIsError(true);
      setErrorMessage("*Harap lengkapi email dan password.");
      return;
    }

    // 2. Jalankan fungsi validasi format
    const validation = validateAuth(email, password);
    if (!validation.isValid) {
      setIsError(true);
      setErrorMessage(
        "*Email tidak valid atau password kurang dari 8 karakter.",
      );
      return;
    }

    try {
      // Mengirim data ke API Backend
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        // Menampilkan pesan error asli dari server (misal: Email sudah terdaftar)
        setIsError(true);
        setErrorMessage(`*${data.message}`);
        return;
      }

      setIsError(false);
      setErrorMessage("");

      // Menyimpan token & user ke Context, lalu masuk ke Home
      login(data.token, data.user);
      navigate("/");
    } catch (error) {
      setIsError(true);
      setErrorMessage("*Gagal terhubung ke server. Pastikan backend berjalan.");
    }
  };

  return (
    <AuthLayout>
      <div className="mb-10 text-left">
        <h1 className="text-3xl font-bold text-gray-900 leading-tight">
          Buat Akun Baru !
        </h1>
        <p className="text-gray-500 mt-2 text-sm">
          Lengkapi form di bawah untuk mendaftar
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        {/* Email */}
        <div>
          <div className="mb-2 block">
            <Label
              htmlFor="email"
              value="Email"
              className="font-semibold text-gray-800"
            />
          </div>
          <TextInput
            id="email"
            type="email"
            placeholder="Masukkan email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            color={isError ? "failure" : "gray"}
            className="[&_input]:rounded-full"
          />
        </div>

        {/* Password */}
        <div>
          <div className="mb-2 block">
            <Label
              htmlFor="password"
              value="Password"
              className="font-semibold text-gray-800"
            />
          </div>
          <div className="relative">
            <TextInput
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Masukkan Paswword"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              color={isError ? "failure" : "gray"}
              className="[&_input]:rounded-full [&_input]:pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-4 flex items-center mt-0"
            >
              {showPassword ? <IconEyeOff /> : <IconEye />}
            </button>
          </div>
          {isError && (
            <p className="text-xs text-red-500 mt-2 ml-1 font-medium">
              {errorMessage}
            </p>
          )}
        </div>

        {/* Syarat dan Ketentuan */}
        <div className="flex items-center gap-2 mt-1">
          <Checkbox
            id="terms"
            className="focus:ring-amber-400 text-amber-500"
            required
          />
          <Label
            htmlFor="terms"
            className="text-sm font-medium text-gray-700 cursor-pointer"
          >
            Saya setuju dengan syarat & ketentuan
          </Label>
        </div>

        {/* Tombol Daftar */}
        <Button
          type="submit"
          className="w-full bg-[#F59E0B] enabled:hover:bg-amber-600 rounded-full mt-2"
        >
          Daftar
        </Button>
      </form>

      {/* Pembatas */}
      <div className="flex items-center gap-3 my-8">
        <div className="flex-1 h-px bg-gray-300"></div>
        <p className="text-xs text-gray-400 font-medium">atau daftar dengan</p>
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>

      {/* Tombol Sosial */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-300 rounded-full hover:bg-gray-50 transition font-medium text-sm text-gray-700"
        >
          <IconGoogle />
          Google
        </button>
        <button
          type="button"
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#1877F2] rounded-full hover:bg-blue-600 transition font-medium text-sm text-white"
        >
          <IconFacebook />
          Facebook
        </button>
      </div>

      {/* Navigasi Toggle */}
      <div className="mt-12 text-center text-sm">
        <p className="text-gray-500 font-medium">
          Sudah mempunyai akun?{" "}
          <NavLink
            to="/login"
            className="text-[#F59E0B] font-bold hover:underline"
          >
            MASUK
          </NavLink>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Register;
