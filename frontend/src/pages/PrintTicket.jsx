import React, { useEffect, useState } from "react";
import Logo from "../assets/logo-arenan-kalikesek.png";

export default function CetakTiket() {
  const [ticketData, setTicketData] = useState(null);
  const [waktuCetak, setWaktuCetak] = useState("");

  useEffect(() => {
    const storedData = localStorage.getItem("ticketData");
    if (storedData) {
      setTicketData(JSON.parse(storedData));
    }

    const now = new Date();
    const formatted = now.toLocaleString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    setWaktuCetak(formatted);

    setTimeout(() => {
      window.print();
      localStorage.removeItem("ticketData");
    }, 500);
  }, []);

  if (!ticketData) return <p>Data tiket tidak tersedia</p>;

  const jumlahTiket = parseInt(ticketData.jumlahTiket) || 1;
  const tiketList = Array.from({ length: jumlahTiket });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white print:bg-white">
      {tiketList.map((_, index) => (
        <div
          key={index}
          className=" p-3 my-2 w-[260px] text-[11px] font-mono print:break-after-page"
        >
          <div className="text-center font-bold leading-tight">
            -------------------------<br />
            <div className="flex justify-center">
                    <img
                      src={Logo}
                      alt="Logo Arenan Kalikesek"
                      className="h-16 object-contain"
                    />
                  </div><br />
            {waktuCetak}<br />
            -------------------------
          </div>
          <br />
          <div className="mt-2 whitespace-pre-line font-bold leading-relaxed">
            Pemesan     : {ticketData.namaPemesan}
            <br />
            Wahana     &nbsp;: {ticketData.wahana}
            <br />
            Jumlah     &nbsp;: {ticketData.jumlahTiket} ({index + 1}/{jumlahTiket})
            <br />
            Total      &nbsp;&nbsp;: Rp {ticketData.totalHarga.toLocaleString("id-ID")}
          </div>
          <br />
          <div className="text-center font-extrabold text-[28px] my-1">
            {ticketData.statusBayar.toUpperCase()}
          </div>
          <div className="mt-2 text-center text-[10px] font-bold leading-snug">
            -----------------------------------<br />
            Terima kasih dan<br />
            Selamat Menikmati Wahana!
          </div>
        </div>
      ))}
    </div>
  );
}
