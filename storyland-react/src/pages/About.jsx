import React, { useEffect } from "react";
import CtaDownload from "../components/CtaDownload";

const IconPinkInsta = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#E1306C"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const IconGreenWA = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#25D366"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full">
      {/* 1. Banner */}
      <div className="w-full bg-[#91C4E8] py-20 md:py-24 flex items-center justify-center text-center">
        <h1 className="text-xl md:text-2xl font-bold text-black leading-snug">
          Banner
          <br />
          Tentang Funtasya
        </h1>
      </div>

      {/* Container Utama */}
      <div className="mx-3 md:mx-20 lg:mx-42 px-6 py-16 md:py-24 flex flex-col gap-16 md:gap-24">
        {/* 2. Cerita Kami */}
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-center">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#FF5A36] mb-6">
              Cerita Kami
            </h2>
            <p className="text-gray-800 leading-relaxed text-justify md:text-left text-sm md:text-base">
              Selamat datang di Children’s Story – Storyland, dunia cerita anak
              yang penuh keajaiban dan petualangan seru. Storyland menghadirkan
              berbagai cerita anak interaktif seperti dongeng klasik, fabel
              penuh pesan moral, legenda budaya dari berbagai negara, serta
              kisah inspiratif Islami yang membantu anak belajar nilai kebaikan
              sambil berimajinasi. Anak-anak dapat menikmati cerita sebelum
              tidur, mendengarkan kisah para nabi, membaca dongeng terkenal
              dunia, serta menjelajahi cerita dari berbagai budaya dalam satu
              aplikasi yang menyenangkan dan edukatif. Cocok untuk waktu
              membaca, cerita sebelum tidur, atau momen belajar bersama
              keluarga.
            </p>
          </div>
          {/* Placeholder Gambar Kanan */}
          <div className="w-full md:w-100 xl:w-115 aspect-4/3 bg-[#D9D9D9] rounded-4xl shrink-0"></div>
        </div>

        {/* 3. Visi & Misi */}
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-center">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#10B981] mb-6">
              Visi & Misi
            </h2>
            <ol className="list-decimal list-inside text-gray-800 space-y-3 leading-relaxed text-sm md:text-base font-medium">
              <li>
                Menciptakan konten digital edukatif yang berkualitas dan aman
                untuk anak.
              </li>
              <li>
                Menghadirkan pengalaman belajar yang fun, interaktif, dan
                adaptif.
              </li>
              <li>Membantu guru dan orang tua dalam proses belajar anak.</li>
              <li>Membangun platform ekosistem yang terintegrasi.</li>
              <li>
                Membangun IP dan karakter original Indonesia yang kuat dan
                mendunia.
              </li>
            </ol>
          </div>
          {/* Placeholder Gambar Kanan */}
          <div className="w-full md:w-100 xl:w-115 aspect-4/3 bg-[#D9D9D9] rounded-4xl shrink-0"></div>
        </div>

        {/* 4. Kontak Kami */}
        <div className="flex flex-col">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#FF5A36] mb-6">
            Kontak Kami
          </h2>
          <div className="flex flex-col gap-3 font-medium text-gray-800 text-sm md:text-base">
            <div className="flex items-center gap-3">
              <IconPinkInsta /> @joyleapstudio
            </div>
            <div className="flex items-center gap-3">
              <IconPinkInsta /> @funtasya.world
            </div>
            <div className="flex items-center gap-3">
              <IconPinkInsta /> @funtasya.storyland
            </div>
            <div className="flex items-center gap-3">
              <IconGreenWA /> 0851 3875 3141
            </div>
          </div>
        </div>
      </div>

      {/* 5. CTA Section */}
      <CtaDownload />
    </div>
  );
};

export default About;
