import React from "react";
import ProgressCard from "./ProgressCard";

const Progress = ({ data, search }) => {
  const filterBySearch = (items) => {
    if (!search) return items;
    return items.filter((item) =>
      item.book?.title?.toLowerCase().includes(search.toLowerCase()),
    );
  };

  const groups = Object.entries(data);
  const hasResults = groups.some(
    ([, items]) => filterBySearch(items).length > 0,
  );

  // Jika kosong, margin tetap konsisten
  if (!hasResults) {
    return (
      <div className="mx-3 md:mx-20 lg:mx-42 px-6 py-20 text-center text-gray-400 font-medium">
        Tidak ada buku ditemukan.
      </div>
    );
  }

  return (
    // Margin disamakan dengan global: mx-3 md:mx-20 lg:mx-42 px-6
    <div className="mx-3 md:mx-20 lg:mx-42 px-6 mb-20">
      {groups.map(([label, items]) => {
        const filtered = filterBySearch(items);
        if (filtered.length === 0) return null;

        return (
          <div key={label} className="mt-12">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">{label}</h3>

            {/* Menggunakan flex-wrap dengan gap 20px seperti di Home */}
            <div className="flex flex-wrap gap-[20px]">
              {filtered.map((item) => (
                // Mengunci ukuran Card sebesar 179x255
                <div
                  key={item.id}
                  className="w-[179px] shrink-0 transition-transform duration-300 hover:scale-105 cursor-pointer"
                >
                  <ProgressCard progress={item} />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Progress;
