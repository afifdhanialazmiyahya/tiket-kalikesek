import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


const RekapPenjualan = () => {
  const [pemesanan, setPemesanan] = useState([]);
  const [wahanaList, setWahanaList] = useState([]);
  const [filter, setFilter] = useState({
    wahana: "",
    tanggalAwal: "",
    tanggalAkhir: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  useEffect(() => {
    fetchData();
    fetch(`${API_URL}/api/wahana`)
      .then((res) => res.json())
      .then((data) => setWahanaList(data));
  }, []);

  const fetchData = () => {
    const params = new URLSearchParams();
    if (filter.wahana) params.append("wahana", filter.wahana);
    if (filter.tanggalAwal && filter.tanggalAkhir) {
      params.append("tanggal_awal", filter.tanggalAwal);
      params.append("tanggal_akhir", filter.tanggalAkhir);
    }

    const url = `${API_URL}/api/pemesanan?${params.toString()}`;
    console.log("Fetching:", url);

    fetch(url)
      .then((res) => res.json())
      .then((data) => setPemesanan(data))
      .catch((err) => console.error("Gagal ambil data:", err));
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(pemesanan);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Rekap Penjualan");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, "rekap-penjualan.xlsx");
  };

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset ke halaman pertama setelah filter
    fetchData();
  };

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = pemesanan.slice(startIndex, endIndex);
  const totalPages = Math.ceil(pemesanan.length / itemsPerPage);

  return (
    <div className="ml-64 ">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl text-slate-700 font-bold">Rekap Penjualan Tiket</h1>
      </div>

      {/* Form Filter dan Ekspor */}
      <form
        onSubmit={handleFilterSubmit}
        className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        <div>
          <label className="block text-sm text-slate-700 font-medium mb-1">Wahana</label>
          <select
            name="wahana"
            value={filter.wahana}
            onChange={handleFilterChange}
            className="w-full border text-slate-700 border-gray-300 bg-white px-3 py-2 rounded"
          >
            <option value="">Semua Wahana</option>
            {wahanaList.map((w) => (
              <option key={w.id} value={w.nama}>
                {w.nama}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700 font-medium mb-1">Tanggal Awal</label>
          <input
            type="date"
            name="tanggalAwal"
            value={filter.tanggalAwal}
            onChange={handleFilterChange}
            className="w-full border text-slate-700 border-gray-300 bg-white px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 font-medium mb-1">Tanggal Akhir</label>
          <input
            type="date"
            name="tanggalAkhir"
            value={filter.tanggalAkhir}
            onChange={handleFilterChange}
            className="w-full border text-slate-700 border-gray-300 bg-white px-3 py-2 rounded"
          />
        </div>

        <div className="flex gap-2 items-end">
          <button
            type="submit"
            className="flex-1 bg-gray-100 border-2 border-gray-400 text-slate-800 px-3 py-2 rounded hover:bg-gray-200 hover:border-slate-700"
          >
            Filter
          </button>

          <button
            type="button"
            onClick={exportToExcel}
            className="flex-1 bg-slate-600 border-2 text-white px-3 py-2 rounded hover:bg-slate-700 hover:border-slate-700"
          >
            Ekspor
          </button>
        </div>
      </form>


      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-400 text-slate-800">
            <tr>
              <th className="text-left px-4 py-2 w-[22px] border-b">No</th>
              <th className="text-left px-4 py-2 w-[200px] border-b">Nama Pemesan</th>
              <th className="text-left px-4 py-2 w-[140px] border-b">Wahana</th>
              <th className="text-left px-4 py-2 border-b">Jumlah Tiket</th>
              <th className="text-left px-4 py-2 w-[125px] border-b">Total Harga</th>
              <th className="text-left px-4 py-2 border-b">Metode Pembayaran</th>
              <th className="text-left px-4 py-2 border-b">Tanggal Pesan</th>
            </tr>
          </thead>
          <tbody className="text-slate-700">
            {currentData.map((item, index) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{startIndex + index + 1}</td>
                <td className="px-4 py-2">{item.nama_pemesan}</td>
                <td className="px-4 py-2">{item.nama_wahana}</td>
                <td className="px-4 py-2">{item.jumlah_tiket}</td>
                <td className="px-4 py-2">
                  Rp {(item.harga_wahana * item.jumlah_tiket).toLocaleString("id-ID")}
                </td>
                <td className="px-4 py-2">{item.metode_pembayaran}</td>
                <td className="px-4 py-2">
                  {new Date(item.tanggal_pesan).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center gap-2 flex-wrap">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded ${
            currentPage === 1
              ? "bg-gray-300 text-slate-700"
              : "bg-blue-500 text-slate-400 hover:bg-blue-600"
          }`}
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1
                ? "bg-slate-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded ${
            currentPage === totalPages
              ? "bg-gray-300 text-slate-700"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default RekapPenjualan;
