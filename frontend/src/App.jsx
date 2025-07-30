import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import RekapPenjualan from "./pages/RekapPenjualan";
import PrintTicket from "./pages/PrintTicket";

function AppRoutes() {
  const location = useLocation();
  const isPrintPage = location.pathname === "/cetak-tiket";

  if (isPrintPage) {
    // Hanya render halaman cetak tanpa layout dan sidebar
    return (
      <Routes>
        <Route path="/cetak-tiket" element={<PrintTicket />} />
      </Routes>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4 bg-gray-100 min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rekap" element={<RekapPenjualan />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
