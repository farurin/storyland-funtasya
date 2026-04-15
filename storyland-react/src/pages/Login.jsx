import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button, Label, TextInput } from "flowbite-react";
import AuthLayout, {
  IconEye,
  IconEyeOff,
  IconGoogle,
  IconFacebook,
} from "../components/AuthLayout";
import { validateAuth } from "../utils/validation";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setIsError(true);
      setErrorMessage("*Harap lengkapi email dan password.");
      return;
    }

    const validation = validateAuth(email, password);
    if (!validation.isValid) {
      setIsError(true);
      setErrorMessage("*Email atau kata sandi yang Anda masukkan salah.");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setIsError(true);
        setErrorMessage(`*${data.message}`);
        return;
      }

      setIsError(false);
      setErrorMessage("");

      // Simpan tiket dan pindah halaman
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
          Selamat Datang !
        </h1>
        <p className="text-gray-500 mt-2 text-sm">
          Lengkapi Email dan Paswword Untuk Masuk
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
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

        <Button
          type="submit"
          className="w-full bg-[#F59E0B] enabled:hover:bg-amber-600 rounded-full mt-2"
        >
          Masuk
        </Button>
      </form>

      <div className="flex items-center gap-3 my-8">
        <div className="flex-1 h-px bg-gray-300"></div>
        <p className="text-xs text-gray-400 font-medium">atau masuk dengan</p>
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-300 rounded-full hover:bg-gray-50 transition"
        >
          <IconGoogle />
          <span className="text-sm text-gray-700 font-medium">Google</span>
        </button>
        <button
          type="button"
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#1877F2] rounded-full hover:bg-blue-600 transition"
        >
          <IconFacebook />
          <span className="text-sm text-white font-medium">Facebook</span>
        </button>
      </div>

      <div className="mt-12 text-center text-sm">
        <p className="text-gray-500 font-medium">
          Tidak mempunyai akun?{" "}
          <NavLink
            to="/register"
            className="text-[#F59E0B] font-bold hover:underline"
          >
            DAFTAR
          </NavLink>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
