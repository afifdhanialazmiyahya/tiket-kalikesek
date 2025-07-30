import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function WahanaCard({ wahana }) {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nama: "",
    jumlah: 1,
    metode: "Tunai",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.name === "jumlah" ? parseInt(e.target.value) : e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      nama: formData.nama,
      jumlah: parseInt(formData.jumlah),
      metode: formData.metode,
      wahana: wahana.nama,
    };

    try {
      const response = await fetch("http://localhost:3001/api/pemesanan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        const ticketData = {
          petugas: "Petugas 1",
          namaPemesan: formData.nama,
          wahana: wahana.nama,
          jumlahTiket: formData.jumlah,
          hargaSatuan: wahana.harga,
          totalHarga: wahana.harga * formData.jumlah,
          statusBayar: formData.metode === "Tunai" ? "LUNAS" : "BELUM LUNAS",
          tanggal: new Date().toLocaleString("id-ID"),
        };

        localStorage.setItem("ticketData", JSON.stringify(ticketData));
        window.open("/cetak-tiket", "_blank");

        setFormData({ nama: "", jumlah: 1, metode: "Tunai" });
        setShowModal(false);
      } else {
        alert("Terjadi kesalahan saat memesan.");
        console.error("Gagal:", result);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Koneksi ke server gagal.");
    }
  };

  return (
    <>
      <div className="bg-white rounded shadow p-4 hover:shadow-lg transition">
        <h3 className="text-xl font-bold text-slate-700">{wahana.nama}</h3>
        <p className="text-sm text-gray-600">{wahana.deskripsi}</p>
        <p className="text-sm text-gray-800 mt-2 font-semibold">
          Harga Tiket: <span className="text-blue-900">Rp {wahana.harga.toLocaleString("id-ID")}</span>
        </p>
        <div className="mt-4">
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700"
          >
            Pesan Tiket
          </button>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg">
            <h2 className="text-lg text-slate-800 font-bold mb-4">
              Pemesanan Tiket: {wahana.nama}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Nama Pemesan
                </label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  required
                  className="mt-1 block bg-gray-200 text-black w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Jumlah Tiket
                </label>
                <input
                  type="number"
                  name="jumlah"
                  min="1"
                  value={formData.jumlah}
                  onChange={handleChange}
                  required
                  className="mt-1 block bg-gray-200 text-black w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Metode Pembayaran
                </label>
                <select
                  name="metode"
                  value={formData.metode}
                  onChange={handleChange}
                  className="mt-1 block bg-gray-200 text-black w-full border rounded px-3 py-2"
                >
                  <option value="Tunai">Tunai</option>
                  <option value="QRIS">QRIS</option>
                </select>
              </div>

              <div className="text-right text-sm text-gray-700">
                Total Harga:{" "}
                <span className="font-bold text-slate-700">
                  Rp {(wahana.harga * formData.jumlah).toLocaleString("id-ID")}
                </span>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-slate-700 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700"
                >
                  Pesan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
