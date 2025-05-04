"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { json } from "stream/consumers";
import { get } from "http";
import { jsxs } from "react/jsx-runtime";

interface Santri {
  nama: string;
  sekolah: string;
}

export default function DaftarSantri() {
  const [santris, setSantris] = useState<Santri[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [nama, setNama] = useState("");
  const [sekolah, setSekolah] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) return;

    setSantris([...santris, { nama, sekolah }]);
    localStorage.setItem("santri", JSON.stringify([...santris, { nama, sekolah }]))
    setNama("");
    setSekolah("");
    setShowForm(false);
  };
  useEffect(()=> {
    const getData = localStorage.getItem("santri")

    if(getData){
      setSantris(JSON.parse(getData))
    }
  },[])

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      {/* Header */}
      <header className="w-full bg-gray-800 shadow-md mb-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
          <div className="text-2xl font-bold text-white">📖 Tadabbur Quran</div>
          <nav className="flex space-x-6">
            <Link href="/" className="text-gray-300 hover:text-white">
              Beranda
            </Link>
            <Link href="/solat" className="text-gray-300 hover:text-white">
              Jadwal Sholat
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-white">
              Tentang Kami
            </Link>
          </nav>
        </div>
      </header>

      {/* Tombol Aksi */}
      <div className="flex flex-col items-center mb-6 space-y-3">
        <button
          onClick={() => setShowForm(true)}
          className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition"
        >
          Tambah Santri
        </button>
        <button className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition">
          Daftar Santri
        </button>
      </div>

      {/* Modal Input Santri */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white text-black p-6 rounded-lg shadow-lg space-y-4 w-full max-w-md"
          >
            <h2 className="text-xl font-bold">Tambah Santri Baru</h2>
            <div>
              <label className="block mb-1">Nama Santri</label>
              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Nama Sekolah</label>
              <input
                type="text"
                value={sekolah}
                onChange={(e) => setSekolah(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid Daftar Santri */}
      <div className="flex justify-center px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl w-full">
          {santris.map((santri, index) => (
            <div
              key={index}
              className="bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-black transition text-center"
            >
              <h3 className="text-white text-xl font-semibold">
                {santri.nama}
              </h3>
              <p className="text-gray-400 mt-2">{santri.sekolah}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
