import React from "react";
import { HiExclamation } from "react-icons/hi";

const AdminConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  warningText,
  confirmText = "Iya",
  cancelText = "Batalkan",
  variant = "primary",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
      <div className="bg-white rounded-4xl w-full max-w-lg p-8 md:p-10 flex flex-col items-center text-center shadow-2xl animate-scale-up">
        {/* Judul Modal */}
        <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">
          {title}
        </h2>

        {/* Deskripsi Utama */}
        <p className="text-gray-500 font-medium text-sm md:text-base mb-6 leading-relaxed">
          {description}
        </p>

        {/* Warning Box (Hanya muncul jika warningText diisi) */}
        {warningText && (
          <div
            className={`w-full flex gap-3 p-4 rounded-2xl mb-8 text-left border ${
              variant === "danger"
                ? "bg-red-50 border-red-200 text-red-800"
                : "bg-orange-50 border-orange-200 text-orange-800"
            }`}
          >
            <div
              className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${
                variant === "danger" ? "bg-red-200" : "bg-orange-200"
              }`}
            >
              <HiExclamation
                className={`text-xl ${
                  variant === "danger" ? "text-red-700" : "text-orange-700"
                }`}
              />
            </div>
            <p className="text-xs md:text-sm font-bold leading-snug">
              {warningText}
            </p>
          </div>
        )}

        {/* Tombol Aksi */}
        <div className="flex gap-4 w-full">
          <button
            onClick={onConfirm}
            className={`flex-1 py-3.5 rounded-xl font-black text-white transition-all shadow-md hover:scale-[1.02] cursor-pointer ${
              variant === "danger"
                ? "bg-red-500 hover:bg-red-600"
                : "bg-[#F8AF2F] hover:bg-yellow-500"
            }`}
          >
            {confirmText}
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3.5 rounded-xl font-black text-gray-400 bg-gray-100 hover:bg-gray-200 transition-all hover:scale-[1.02] cursor-pointer"
          >
            {cancelText}
          </button>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .animate-fade-in { animation: fadeIn 0.2s ease-out; }
        .animate-scale-up { animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleUp { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
      `,
        }}
      />
    </div>
  );
};

export default AdminConfirmModal;
