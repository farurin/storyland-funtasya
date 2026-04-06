import React, { useState } from "react";
import {
  getAllProgress,
  getFavoriteBooks,
  getSavedBooks,
} from "../services/api";
import BannerCorner from "../components/BannerCorner";
import FilterCorner from "../components/FilterCorner";
import Progress from "../components/Progress";
import HeroBanner from "../components/HeroBanner";

const Corner = () => {
  const [activeFilter, setActiveFilter] = useState("riwayat");
  const [search, setSearch] = useState("");

  return (
    <div>
      <BannerCorner />
      <FilterCorner
        activeFilter={activeFilter}
        onChangeFilter={setActiveFilter}
        onSearch={setSearch}
      />
      <Progress activeFilter={activeFilter} search={search} />

      {/* banner */}
      <HeroBanner />
    </div>
  );
};

export default Corner;
