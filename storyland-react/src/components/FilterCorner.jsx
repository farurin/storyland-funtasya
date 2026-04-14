import React from "react";

// Icon SVG
const IconHistory = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l4 2" />
  </svg>
);

const IconLove = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const IconSave = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);

const IconSearch = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#9ca3af"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const filters = [
  { key: "riwayat", label: "Riwayat", icon: IconHistory },
  { key: "favorit", label: "Favorit", icon: IconLove },
  { key: "disimpan", label: "Disimpan", icon: IconSave },
];

const FilterCorner = ({ activeFilter, onChangeFilter, onSearch }) => {
  return (
    <div className="mx-3 md:mx-20 lg:mx-42 px-6 mt-14 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
      {/* Button Filter */}
      <div className="flex flex-wrap items-center gap-4">
        {filters.map(({ key, label, icon: IconComponent }) => {
          const isActive = activeFilter === key;
          return (
            <button
              key={key}
              onClick={() => onChangeFilter(key)}
              className={`flex flex-row items-center gap-2.5 px-6 py-2.5 rounded-full text-base font-bold transition-all shadow-sm focus:outline-none 
                ${
                  isActive
                    ? "bg-[#7A5AF8] text-white scale-105 shadow-md"
                    : "bg-[#F2E9FF] text-[#7A5AF8] hover:bg-[#E8D9FF]"
                }
              `}
            >
              <IconComponent
                className={isActive ? "text-white" : "text-[#7A5AF8]"}
              />
              <span className="whitespace-nowrap">{label}</span>
            </button>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="relative w-full xl:w-96 shrink-0">
        <input
          type="text"
          placeholder="Cari judul buku..."
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-6 pr-12 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-transparent text-sm text-gray-600 placeholder-gray-400 shadow-sm"
        />
        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
          <IconSearch />
        </div>
      </div>
    </div>
  );
};

export default FilterCorner;
