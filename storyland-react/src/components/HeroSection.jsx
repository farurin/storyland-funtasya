import React from "react";
import { Button } from "flowbite-react";
import heroImg from "../assets/hero.png";

const Hero = () => {
  // Fungsi scroll ke carousel
  const handleScroll = () => {
    const targetSection = document.getElementById("jelajahi-cerita");
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="mt-14 mx-3 md:mx-20 lg:mx-42">
      <div className="flex flex-col-reverse lg:flex-row items-center gap-10 bg-[#A454FF] rounded-3xl px-6 md:px-10 py-10 md:py-14">
        {/* left content */}
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <h1 className="text-white font-bold text-3xl md:text-4xl lg:text-5xl leading-tight">
            Saatnya Membaca!
          </h1>

          <p className="text-white/90 mt-4 text-sm md:text-base max-w-md mx-auto lg:mx-0">
            Banyak kisah menarik menunggu untuk kamu jelajahi. Temukan cerita
            favoritmu sekarang.
          </p>

          <div className="mt-6 flex justify-center lg:justify-start">
            <Button
              onClick={handleScroll}
              className="capitalize bg-yellow-300 hover:bg-yellow-200 text-[#A454FF] font-semibold rounded-full px-6 py-2 shadow-md hover:shadow-lg transition cursor-pointer"
            >
              mulai jelajahi cerita
            </Button>
          </div>
        </div>

        {/* hero img */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <img
            src={heroImg}
            alt="Hero Illustration"
            className="w-48 md:w-64 lg:w-80 object-contain drop-shadow-xl hover:-translate-y-2 transition-transform duration-500"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
