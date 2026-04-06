import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Corner from "./pages/Corner";

export default function App() {
  return (
    <Routes>
      {/* main layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/corner" element={<Corner />} />
      </Route>
    </Routes>
  );
}
