import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Button, Label, TextInput } from "flowbite-react";
import AuthLayout, {
  IconEye,
  IconEyeOff,
  IconGoogle,
  IconFacebook,
} from "../components/AuthLayout";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form dikirim!");
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

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            color={isError ? "failure" : "gray"}
            helperText={
              isError && (
                <span className="font-medium text-red-600">
                  *email atau kata sandi yang anda masukkan salah
                </span>
              )
            }
            className="[&_input]:rounded-full"
            required
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
              color={isError ? "failure" : "gray"}
              className="[&_input]:rounded-full [&_input]:pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-4 flex items-center mt-0"
            >
              {showPassword ? <IconEyeOff /> : <IconEye />}
            </button>
          </div>
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
        <button className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-300 rounded-full hover:bg-gray-50 transition">
          <IconGoogle />
          <span className="text-sm text-gray-700 font-medium">Google</span>
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#1877F2] rounded-full hover:bg-blue-600 transition">
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
