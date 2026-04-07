import { Outlet } from "react-router-dom";
import Navigation from "../components/Navbar";
import Footer from "../components/Footer";

export default function MainLayout() {
  return (
    <>
      <Navigation />
      <main className="">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
