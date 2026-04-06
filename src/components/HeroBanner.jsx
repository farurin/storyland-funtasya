import React from "react";
import loveCat from "../assets/lovecat.png";

const HeroBanner = () => {
  return (
    <section className="bg-[#F0EDFF] mt-20 w-full py-10">
      <div className="mx-3 md:mx-20 lg:mx-42 px-6 md:px-10 flex flex-col lg:flex-row items-center justify-between gap-10">
        {/* Left Content */}
        <div className="max-w-xl text-center lg:text-left">
          <h1 className="text-3xl md:text-4xl font-bold leading-tight text-black">
            Dunia Cerita Seru <br /> Menunggumu!
          </h1>

          <p className="mt-4 text-gray-800 text-sm md:text-base">
            Jelajahi petualangan, dongeng, dan kisah seru lainnya langsung dari
            aplikasi Funtasya StoryLand.
          </p>

          <div className="flex items-center justify-center lg:justify-start gap-4 mt-6">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
              alt="Google Play"
              className="h-10  cursor-pointer"
            />
            <img
              src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
              alt="App Store"
              className="h-10 cursor-pointer"
            />
          </div>
        </div>

        {/* Right Image */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <img
            src={loveCat}
            alt="Love Cat"
            className="w-48 md:w-64 lg:w-96 object-contain drop-shadow-xl"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
