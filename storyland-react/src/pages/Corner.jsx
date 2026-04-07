import React, { useState } from "react";
import {
  getFavoriteBooks,
  getSavedBooks,
  getProgressGroupedByDate,
} from "../services/api";
import BannerCorner from "../components/BannerCorner";
import FilterCorner from "../components/FilterCorner";
import Progress from "../components/Progress";
import CtaDownload from "../components/CtaDownload";

const Corner = () => {
  const [activeFilter, setActiveFilter] = useState("riwayat");
  const [search, setSearch] = useState("");

  // Langsung hitung data tanpa useEffect
  let progressData = {};
  if (activeFilter === "favorit") {
    progressData = { Favorit: getFavoriteBooks() };
  } else if (activeFilter === "disimpan") {
    progressData = { Disimpan: getSavedBooks() };
  } else {
    progressData = getProgressGroupedByDate();
  }

  return (
    <div>
      <BannerCorner />
      <FilterCorner
        activeFilter={activeFilter}
        onChangeFilter={setActiveFilter}
        onSearch={setSearch}
      />
      <Progress data={progressData} search={search} />
      <CtaDownload />
    </div>
  );
};

export default Corner;
