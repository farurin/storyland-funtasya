import React from "react";
import signinupUlistration from "/images/signinup-ulistration.png";

// Icon Mata Terbuka
const IconEye = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    className="text-gray-400"
  >
    <path
      fill="currentColor"
      d="M12 9a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5a5 5 0 0 1 5-5a5 5 0 0 1 5 5a5 5 0 0 1-5 5m0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5Z"
    />
  </svg>
);

// Icon Mata Tertutup
// Ikon Mata Tertutup (Dicoret)
const IconEyeOff = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    className="text-gray-400"
  >
    <path
      fill="currentColor"
      d="M11.83 9L15 12.16V12a3 3 0 0 0-3-3h-.17m-4.3.8l1.55 1.55c-.05.21-.08.43-.08.65a3 3 0 0 0 3 3c.22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53a5 5 0 0 1-5-5c0-.79.2-1.53.53-2.2M2 4.27l2.28 2.28l.46.46C3.08 8.3 1.78 10 1 12c1.73 4.39 6 7.5 11 7.5c1.35 0 2.64-.27 3.82-.75l.44.44l2.47 2.47l1.27-1.27L3.27 3L2 4.27m10 12.73c-4.53 0-8.36-2.61-10.15-6.5c1.3-2.85 3.58-5 6.46-5.91l2.36 2.36c-.19.46-.3.96-.3 1.5a5 5 0 0 0 5 5c.54 0 1.04-.11 1.5-.3l2.36 2.36c-.91.88-3.06 1.89-5.91 1.89m9.15-8.5c-.21-.49-.45-.96-.72-1.4l-1.63 1.63c.21.35.4.72.56 1.1c-1.79 3.89-5.62 6.5-10.15 6.5c-.32 0-.64-.02-.95-.06l-1.39 1.39C10.1 19.34 11.04 19.5 12 19.5c5 0 9.27-3.11 11-7.5M12 4.5c-1.57 0-3.07.38-4.42 1.05l1.49 1.49C10 6.64 10.97 6.5 12 6.5c4.53 0 8.36 2.61 10.15 6.5c-.38.83-.84 1.6-1.38 2.3l1.49 1.49c.8-1.02 1.48-2.16 1.99-3.41C21.27 7.61 17 4.5 12 4.5Z"
    />
  </svg>
);

const IconGoogle = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 48 48"
  >
    <path
      fill="#FFC107"
      d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.954 4 4 12.954 4 24s8.954 20 20 20s20-8.954 20-20c0-1.341-.138-2.65-.389-3.917Z"
    />
    <path
      fill="#FF3D00"
      d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691Z"
    />
    <path
      fill="#4CAF50"
      d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44Z"
    />
    <path
      fill="#1976D2"
      d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917Z"
    />
  </svg>
);

const IconFacebook = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    className="text-white"
  >
    <path
      fill="currentColor"
      d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95Z"
    />
  </svg>
);

export { IconEye, IconEyeOff, IconGoogle, IconFacebook };

const AuthLayout = ({ children }) => {
  return (
    <div className="w-full h-screen flex overflow-hidden">
      {/* Gambar disembunyikan di layar kecil dengan hidden lg:flex */}
      <div className="hidden lg:flex w-1/2 h-full bg-[#E5F7E5] items-center justify-center p-0">
        <img
          src={signinupUlistration}
          alt="Signinup Ulistration"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Form menjadi lebar penuh (w-full) di layar kecil */}
      <div className="w-full lg:w-1/2 h-full bg-white flex flex-col justify-center px-12 md:px-16 lg:px-24 xl:px-32 overflow-y-auto">
        <div className="w-full max-w-md mx-auto">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
