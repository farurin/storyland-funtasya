import React from "react";
import ProgressCard from "./ProgressCard";

const Progress = ({ data, search, type }) => {
  const filterBySearch = (items) => {
    if (!search) return items;
    return items.filter((item) => {
      const title = item.book?.title || item.title;
      return title?.toLowerCase().includes(search.toLowerCase());
    });
  };

  const groups = Object.entries(data);
  const hasResults = groups.some(
    ([, items]) => filterBySearch(items).length > 0,
  );

  if (!hasResults) {
    return (
      <div className="mx-3 md:mx-20 lg:mx-42 px-6 py-20 text-center text-gray-400 font-medium">
        Tidak ada buku ditemukan.
      </div>
    );
  }

  return (
    <div className="mx-3 md:mx-20 lg:mx-42 px-6 mb-20">
      {groups.map(([label, items]) => {
        const filtered = filterBySearch(items);
        if (filtered.length === 0) return null;

        // Hanya tampilkan label ("Hari Ini", "Kemarin") jika di tab Riwayat
        const showLabel = type === "riwayat";

        return (
          <div key={label} className={showLabel ? "mt-12" : "mt-8"}>
            {showLabel && (
              <h3 className="text-2xl font-bold text-gray-800 mb-6">{label}</h3>
            )}

            <div className="flex flex-wrap gap-5">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className="w-44.75 shrink-0 transition-transform duration-300 hover:scale-105 cursor-pointer"
                >
                  <ProgressCard progress={item} type={type} />
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
