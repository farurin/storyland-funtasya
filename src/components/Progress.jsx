import React from "react";
import {
  getProgressGroupedByDate,
  getFavoriteBooks,
  getSavedBooks,
} from "../services/api";
import ProgressCard from "./ProgressCard";

const Progress = ({ activeFilter, search }) => {
  const getData = () => {
    if (activeFilter === "favorit") return { Favorit: getFavoriteBooks() };
    if (activeFilter === "disimpan") return { Disimpan: getSavedBooks() };
    return getProgressGroupedByDate();
  };

  const filterBySearch = (items) => {
    if (!search) return items;
    return items.filter((item) =>
      item.book?.title?.toLowerCase().includes(search.toLowerCase()),
    );
  };

  const grouped = getData();
  const groups = Object.entries(grouped);
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

            {/* ✅ grid responsive: 2 kolom mobile → 4 tablet → 5 md → 6 lg → 7 xl */}
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
