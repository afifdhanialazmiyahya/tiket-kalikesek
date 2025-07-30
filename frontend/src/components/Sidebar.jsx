import React from "react";
import { Link } from "react-router-dom";
import HomeIcon from "../assets/home.svg";
import ChecklistIcon from "../assets/checklist.svg";
import Logo from "../assets/logo-arenan-kalikesek.png";

export default function Sidebar() {
  return (
    <div className="w-64 bg-slate-900 shadow-md h-screen flex flex-col fixed">
      <div className="p-4 border-b flex justify-center">
        <img
          src={Logo}
          alt="Logo Arenan Kalikesek"
          className="h-16 object-contain"
        />
      </div>
      <nav className="flex flex-col mt-4">
        <Link to="/" className="py-3 px-6 text-gray-200 hover:bg-slate-800 flex items-center gap-2">
          <img src={HomeIcon} alt="Beranda" className="w-5 h-5" />
          Beranda
        </Link>
        <Link to="/rekap" className="py-3 px-6 text-gray-200 hover:bg-slate-800 flex items-center gap-2">
          <img src={ChecklistIcon} alt="Rekap" className="w-5 h-5" />
          Rekap Penjualan
        </Link>
      </nav>
    </div>
  );
}
