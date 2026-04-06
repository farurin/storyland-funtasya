import React from "react";
import { Link } from "react-router-dom";
import HeroBanner from "../components/HeroBanner";

// Ikon panah ungu lingkaran sesuai desain Figma
const IconArrowCircle = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill="none"
  >
    <circle cx="12" cy="12" r="12" fill="#6B4EFF" />
    <path
      d="M10.5 8L14.5 12L10.5 16"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Categories = () => {
  // Data disesuaikan persis dengan nama file di folder public/images/category/
  const categoriesList = [
    {
      id: 1,
      title: "Cerita Nusantara",
      count: 12,
      image: "cat1-cerita-nusantara.png",
    },
    { id: 2, title: "Cerita Hewan", count: 12, image: "cat2-cerita-hewan.png" },
    {
      id: 3,
      title: "Cerita Pahlawan Nusantara",
      count: 12,
      image: "cat3-cerita-pahlawan-nusantara.png",
    },
    {
      id: 4,
      title: "Cerita Anak Muslim",
      count: 12,
      image: "cat4-cerita anak muslim.png",
    },
    {
      id: 5,
      title: "Cerita 1001 Malam",
      count: 12,
      image: "cat5-cerita-1001-malam.png",
    },
    {
      id: 6,
      title: "Cerita Anak Tauladan",
      count: 12,
      image: "cat6-cerita-anak-tauladan.png",
    },
    {
      id: 7,
      title: "Cerita Mancanegara",
      count: 12,
      image: "cat7-cerita-mancanegara.png",
    },
    {
      id: 8,
      title: "Kisah Nabi & Rosul",
      count: 12,
      image: "cat8-kisah-nabi-dan-rosul.png",
    },
  ];

  return (
    <div className="w-full">
      {/* Header Section */}
      <section className="mx-3 md:mx-20 lg:mx-42 px-6 mt-12 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Kategori
        </h1>
        <p className="text-gray-500 mt-2 text-sm md:text-base">
          Temukan berbagai macam cerita menarik berdasarkan kategori pilihan.
        </p>
      </section>

      {/* Grid Categories */}
      <section className="mx-3 md:mx-20 lg:mx-42 px-6 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {categoriesList.map((cat) => (
            <Link
              to={`/categories/${cat.id}`}
              key={cat.id}
              className="group block bg-white border border-gray-100 rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              {/* Bagian Atas: Gambar Ilustrasi */}
              <div className="w-full aspect-[2/1] bg-gray-50 overflow-hidden relative">
                <img
                  src={`/images/category/${cat.image}`}
                  alt={cat.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/600x300?text=Ilustrasi+Kategori";
                  }}
                />
              </div>

              {/* Bagian Bawah: Teks & Ikon */}
              <div className="p-5 flex items-center justify-between">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                  {cat.title}
                </h2>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-600">
                    {cat.count} cerita
                  </span>
                  <IconArrowCircle />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Download App */}
      <HeroBanner />
    </div>
  );
};

export default Categories;
