import React from "react";
import defaultBg from "../assets/banner_corner.png";

const BannerCorner = ({
  title = "Corner",
  description = "Ayo lihat riwayat bacaanmu, buku favorit dan yang sudah kamu simpan disini",
  bgImage = defaultBg,
}) => {
  return (
    <div
      className="w-full overflow-hidden relative h-80 flex items-center justify-center"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0" />

      {/* Teks di tengah banner */}
      <div className="relative z-10 text-center px-6">
        <h2 className="text-black text-3xl md:text-4xl font-bold leading-tight">
          {title}
        </h2>
        <p className="text-black mt-3 text-sm md:text-base mx-auto max-w-lg">
          {description}
        </p>
      </div>
    </div>
  );
};

export default BannerCorner;
