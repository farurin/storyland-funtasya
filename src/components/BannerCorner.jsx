import React from "react";
import bgBanner from "../assets/banner_corner.png";

const BannerCorner = () => {
  return (
    <div
      className="w-full overflow-hidden relative h-80 flex items-center justify-center px-10 md:px-16 py-10"
      style={{
        backgroundImage: `url(${bgBanner})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0" />

      <div className="relative z-10 text-center">
        <h2 className="text-black text-2xl md:text-3xl font-bold leading-tight">
          Corner
        </h2>
        <p className="text-black mt-3 text-sm md:text-base mx-auto">
          Ayo lihat riwayat bacaanmu, buku favorit dan yang sudah kamu simpan
          disini
        </p>
      </div>
    </div>
  );
};

export default BannerCorner;
