import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button, Label, TextInput } from "flowbite-react";
import AuthLayout, {
  IconEye,
  IconEyeOff,
  IconGoogle,
  IconFacebook,
} from "../components/AuthLayout";
import { validateRegister } from "../utils/validation";
import { useAuth } from "../context/AuthContext";
import { registerUser } from "../services/api";
import ActionPopupModal from "../components/ActionPopupModal";

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateRegister(email, password);
    if (!validation.isValid) {
      setIsError(true);
      // Tampilkan error spesifik dari validation.js (email atau password)
      setErrorMessage(validation.errors.email || validation.errors.password);
      return;
    }

    try {
      const data = await registerUser({ email, password });

      setIsError(false);
      setErrorMessage("");
      login(data.token, data.user);
      navigate("/");
    } catch (error) {
      setIsError(true);
      setErrorMessage(`*${error.message}`);
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
            color={
              isError && errorMessage.includes("Email") ? "failure" : "gray"
            }
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
              placeholder="Masukkan Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              color={
                isError && errorMessage.includes("Password")
                  ? "failure"
                  : "gray"
              }
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
            <p className="text-xs text-red-500 mt-2 ml-1 font-medium leading-relaxed">
              {errorMessage}
            </p>
          )}
        </div>

        {/* Tombol Daftar */}
        <Button
          type="submit"
          className="w-full bg-[#F59E0B] enabled:hover:bg-amber-600 rounded-full mt-4"
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
          onClick={() => setIsModalOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-300 rounded-full hover:bg-gray-50 transition font-medium text-sm text-gray-700"
        >
          <IconGoogle />
          Google
        </button>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
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

      {/* Popup Modal */}
      <ActionPopupModal
        isOpen={isModalOpen}
        image="/images/popups/popup-fav.png"
        title="Fitur Segera Hadir!"
        description="Maaf, fitur pendaftaran menggunakan Google dan Facebook saat ini masih dalam tahap pengembangan."
        primaryBtnText="Oke, Mengerti"
        primaryBtnColor="bg-[#F59E0B]"
        secondaryBtnText="Tutup"
        onPrimaryClick={() => setIsModalOpen(false)}
        onSecondaryClick={() => setIsModalOpen(false)}
      />
    </AuthLayout>
  );
};

export default Register;
