import React, { useEffect, useState } from "react";
import WahanaCard from "../components/WahanaCard";

export default function Home() {
  const [daftarWahana, setDaftarWahana] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/wahana")
      .then((res) => res.json())
      .then((data) => setDaftarWahana(data))
      .catch((err) => console.error("Gagal ambil wahana:", err));
  }, []);

  return (
    <div className="ml-64">
      <h2 className="text-3xl text-slate-700 font-bold mb-6">Daftar Wahana</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {daftarWahana.map((wahana) => (
          <WahanaCard key={wahana.id} wahana={wahana} />
        ))}
      </div>
    </div>
  );
}
