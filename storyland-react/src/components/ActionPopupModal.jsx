import React from "react";

const ActionPopupModal = ({
  isOpen,
  image,
  title,
  description,
  primaryBtnText,
  primaryBtnColor,
  secondaryBtnText,
  onPrimaryClick,
  onSecondaryClick,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-120 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
      <div className="relative bg-white rounded-4xl w-[92%] max-w-115 pt-6 pb-8 px-6 md:px-10 flex flex-col items-center text-center shadow-2xl scale-100 transition-transform mt-16 md:mt-12">
        <div className="absolute -top-22.25 left-1/2 -translate-x-1/2 w-45 h-22.5 bg-white rounded-t-full shadow-[-10px_-10px_15px_-10px_rgba(0,0,0,0.1),10px_-10px_15px_-10px_rgba(0,0,0,0.1)]"></div>
        <div className="relative z-10 w-36 h-36 md:w-40 md:h-40 mb-1 -mt-26.25 md:-mt-28.75 shrink-0 flex items-center justify-center">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-contain drop-shadow-sm"
            onError={(e) =>
              (e.target.src = "https://via.placeholder.com/150?text=Ilustrasi")
            }
          />
        </div>

        {/* Teks Judul */}
        <h2 className="text-2xl md:text-[26px] font-extrabold text-black mb-2 leading-tight">
          {title}
        </h2>

        {/* Teks Deskripsi */}
        <p className="text-xs md:text-sm font-semibold text-gray-500 mb-7 px-2 leading-relaxed">
          {description}
        </p>

        {/* Tombol Aksi Sejajar */}
        <div className="flex gap-3 w-full">
          <button
            onClick={onPrimaryClick}
            className={`flex-1 py-3 md:py-3.5 rounded-2xl font-bold text-white transition-all shadow-md hover:scale-105 cursor-pointer ${primaryBtnColor}`}
          >
            {primaryBtnText}
          </button>
          <button
            onClick={onSecondaryClick}
            className="flex-1 py-3 md:py-3.5 rounded-2xl font-bold text-gray-500 bg-[#F3F4F6] hover:bg-gray-200 transition-all shadow-sm hover:scale-105 cursor-pointer"
          >
            {secondaryBtnText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionPopupModal;
