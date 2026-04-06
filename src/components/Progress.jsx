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

  if (!hasResults) {
    return (
      <div className="w-full max-w-7xl mx-auto px-6 md:px-10 py-10 text-center text-gray-400">
        Tidak ada buku ditemukan.
      </div>
    );
  }

  return (
    <div className="w-full max-w-10/12 mx-auto md:px-10 mb-20">
      {groups.map(([label, items]) => {
        const filtered = filterBySearch(items);
        if (filtered.length === 0) return null;

        return (
          <div key={label} className="mt-10">
            <h3 className="text-lg font-bold text-gray-800 mb-4">{label}</h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 md:gap-4">
              {filtered.map((item) => (
                <ProgressCard key={item.id} progress={item} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Progress;
