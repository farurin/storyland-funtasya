import React from "react";

const IconHistory = () => (
  <div className="bg-white/30 p-1.5 rounded-full">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 20 20"
    >
      <path
        fill="#fff"
        d="M11 1.799c-4.445 0-8.061 3.562-8.169 7.996V10H.459l3.594 3.894L7.547 10H4.875v-.205C4.982 6.492 7.683 3.85 11 3.85c3.386 0 6.131 2.754 6.131 6.15S14.386 16.15 11 16.15a6.1 6.1 0 0 1-3.627-1.193l-1.406 1.504A8.13 8.13 0 0 0 11 18.199c4.515 0 8.174-3.67 8.174-8.199S15.515 1.799 11 1.799M10 5v5a1 1 0 0 0 .293.707l3.2 3.2c.283-.183.55-.389.787-.628L12 11V5z"
      />
    </svg>
  </div>
);

const IconLove = () => (
  <div className="bg-white/30 p-1.5 rounded-full">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
    >
      <path
        fill="#fff"
        d="m12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53z"
      />
    </svg>
  </div>
);

const IconSave = () => (
  <div className="bg-white/30 p-1.5 rounded-full">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
    >
      <path
        fill="#fff"
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M6 6.2c0-1.12 0-1.68.218-2.108a2 2 0 0 1 .874-.874C7.52 3 8.08 3 9.2 3h5.6c1.12 0 1.68 0 2.108.218a2 2 0 0 1 .874.874C18 4.52 18 5.08 18 6.2v13.305c0 .486 0 .729-.101.862a.5.5 0 0 1-.37.198c-.167.01-.369-.125-.773-.394L12 17l-4.756 3.17c-.404.27-.606.405-.774.395a.5.5 0 0 1-.369-.198C6 20.234 6 19.991 6 19.505z"
      />
    </svg>
  </div>
);

const IconSearch = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
  >
    <path
      fill="#9ca3af"
      d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5A6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14"
    />
  </svg>
);

const filters = [
  { key: "riwayat", label: "Riwayat", icon: <IconHistory />, color: "#70A9FF" },
  { key: "favorit", label: "Favorit", icon: <IconLove />, color: "#FF8D9F" },
  { key: "disimpan", label: "Disimpan", icon: <IconSave />, color: "#FFB545" },
];

const FilterCorner = ({ activeFilter, onChangeFilter, onSearch }) => {
  return (
    // Margin disamakan dengan global: mx-3 md:mx-20 lg:mx-42 px-6
    <div className="mx-3 md:mx-20 lg:mx-42 px-6 mt-14 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
      {/* Button Filter dengan style Tab */}
      <div className="flex flex-wrap items-center gap-4">
        {filters.map(({ key, label, icon, color }) => (
          <button
            key={key}
            onClick={() => onChangeFilter(key)}
            style={{ backgroundColor: color }}
            className={`flex items-center gap-3 text-white pl-2 pr-5 py-2 rounded-full text-sm font-bold transition shadow-sm focus:outline-none 
              ${activeFilter === key ? "ring-4 ring-offset-2 opacity-100 scale-105" : "opacity-60 hover:opacity-80"}
            `}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative w-full xl:w-96">
        <input
          type="text"
          placeholder="Cari judul buku..."
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-6 pr-12 py-3 rounded-full border border-gray-200 focus:border-purple-400 focus:ring-0 text-sm text-gray-600 placeholder-gray-400 shadow-sm"
        />
        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
          <IconSearch />
        </div>
      </div>
    </div>
  );
};

export default FilterCorner;
