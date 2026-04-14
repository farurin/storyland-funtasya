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
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-4xl w-full max-w-[360px] p-8 flex flex-col items-center text-center shadow-2xl scale-100 transition-transform">
        {/* Gambar Ilustrasi */}
        <div className="w-40 h-40 mb-2 shrink-0">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-contain"
            onError={(e) =>
              (e.target.src = "https://via.placeholder.com/150?text=Ilustrasi")
            }
          />
        </div>

        {/* Teks */}
        <h2 className="text-[26px] font-extrabold text-black mb-3 leading-tight">
          {title}
        </h2>
        <p className="text-sm font-semibold text-gray-800 mb-8 px-2 leading-relaxed">
          {description}
        </p>

        {/* Tombol Aksi Sejajar */}
        <div className="flex gap-3 w-full">
          <button
            onClick={onPrimaryClick}
            className={`flex-1 py-3.5 rounded-2xl font-bold text-white transition-all shadow-md hover:scale-105 ${primaryBtnColor}`}
          >
            {primaryBtnText}
          </button>
          <button
            onClick={onSecondaryClick}
            className="flex-1 py-3.5 rounded-2xl font-bold text-gray-500 bg-[#F3F4F6] hover:bg-gray-200 transition-all shadow-sm hover:scale-105"
          >
            {secondaryBtnText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionPopupModal;
