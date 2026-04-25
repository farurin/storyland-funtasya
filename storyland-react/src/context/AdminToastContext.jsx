import React, { createContext, useContext, useState, useCallback } from "react";
import { HiCheckCircle, HiXCircle } from "react-icons/hi";

// Context
const AdminToastContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAdminToast = () => useContext(AdminToastContext);

export const AdminToastProvider = ({ children }) => {
  const [toast, setToast] = useState({ isOpen: false, type: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);

  // Fungsi untuk memanggil Toast
  const showToast = useCallback((type, message) => {
    setToast({ isOpen: true, type, message });
    // Otomatis hilang setelah 3 detik
    setTimeout(() => {
      setToast({ isOpen: false, type: "", message: "" });
    }, 3000);
  }, []);

  // Shortcuts
  const showSuccess = (msg) => showToast("success", msg);
  const showError = (msg) => showToast("error", msg);
  const showLoading = (status) => setIsLoading(status);

  return (
    <AdminToastContext.Provider value={{ showSuccess, showError, showLoading }}>
      {children}

      {/* loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-999 bg-black/20 backdrop-blur-sm flex flex-col items-center justify-center cursor-wait animate-fade-in">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-4"></div>
          <p className="text-white font-bold text-lg drop-shadow-md">
            Memproses Data...
          </p>
        </div>
      )}

      {/* toast notification */}
      {toast.isOpen && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-1000 animate-slide-down">
          <div className="bg-white px-6 py-4 rounded-2xl shadow-2xl border border-gray-100 flex items-center gap-4 min-w-75">
            {toast.type === "success" ? (
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <HiCheckCircle className="text-green-600 text-3xl" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <HiXCircle className="text-red-500 text-3xl" />
              </div>
            )}

            <div>
              <h4
                className={`font-extrabold text-lg leading-none mb-1 ${toast.type === "success" ? "text-green-700" : "text-red-600"}`}
              >
                {toast.type === "success" ? "Berhasil!" : "Gagal!"}
              </h4>
              <p className="text-gray-500 font-medium text-sm">
                {toast.message}
              </p>
            </div>
          </div>
        </div>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .animate-fade-in { animation: fadeIn 0.2s ease-out; }
        .animate-slide-down { animation: slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideDown { 0% { opacity: 0; transform: translate(-50%, -20px) scale(0.9); } 100% { opacity: 1; transform: translate(-50%, 0) scale(1); } }
      `,
        }}
      />
    </AdminToastContext.Provider>
  );
};
