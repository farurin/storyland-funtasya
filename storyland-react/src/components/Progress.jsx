import React from "react";
import ProgressCard from "./ProgressCard";
import SavedCard from "./SavedCard";

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

  if (!hasResults) return null;

  return (
    <div className="mx-3 md:mx-20 lg:mx-42 px-6 mb-20">
      {groups.map(([label, items]) => {
        const filtered = filterBySearch(items);
        if (filtered.length === 0) return null;

        // Label Hari ini/Kemarin hanya muncul di tab riwayat
        const showLabel = type === "riwayat";

        return (
          <div key={label} className={showLabel ? "mt-12" : "mt-8"}>
            {showLabel && (
              <h3 className="text-2xl font-bold text-gray-800 mb-6">{label}</h3>
            )}

            {/* --- LOGIKA PERCABANGAN TAMPILAN --- */}
            {type === "disimpan" ? (
              // JIKA TAB DISIMPAN: Tampilkan Grid 2 Kolom dengan SavedCard
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 md:gap-6">
                {filtered.map((item) => (
                  <SavedCard key={item.id} book={item.book || item} />
                ))}
              </div>
            ) : (
              // JIKA TAB RIWAYAT/FAVORIT: Tampilkan Flex Menyamping dengan ProgressCard
              <div className="flex flex-wrap gap-5">
                {filtered.map((item) => (
                  <div key={item.id} className="w-44.75 shrink-0">
                    <ProgressCard progress={item} type={type} />
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Progress;
