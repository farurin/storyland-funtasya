import React from "react";

// Ikon Hati Merah
const IconHeart = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="#EF4444"
    stroke="#EF4444"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const ProgressCard = ({ progress, type }) => {
  // Antisipasi format data dummy yang berbeda-beda
  const book = progress.book || progress;
  const reading_progress = progress.reading_progress ?? 0;

  return (
    <div className="w-full bg-white rounded-[20px] overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer border border-gray-50 relative group">
      {/* Ikon Hati Khusus Tab Favorit */}
      {type === "favorit" && (
        <div className="absolute top-3 right-3 z-10 bg-white/50 backdrop-blur-md p-2 rounded-full shadow-sm hover:scale-110 transition">
          <IconHeart />
        </div>
      )}

      {/* Cover Buku */}
      <div className="w-full aspect-2/3 bg-gray-100 overflow-hidden">
        <img
          src={
            book?.image ? `/images/books/${book.image}` : "/images/default.png"
          }
          alt={book?.title || "Buku"}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/150x220?text=Cover";
          }}
        />
      </div>

      <div className="p-3">
        <h3 className="font-bold text-gray-900 text-sm md:text-base line-clamp-1">
          {book.title || "Judul Buku"}
        </h3>

        {/* Progress bar hanya untuk Tab Riwayat */}
        {type === "riwayat" && (
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-[#A454FF] h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${reading_progress}%` }}
              />
            </div>
            <p className="text-[11px] text-gray-400 mt-1 text-right font-medium">
              {reading_progress}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressCard;
