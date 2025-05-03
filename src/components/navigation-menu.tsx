import Link from "next/link";

export default function Navigation() {
  return (
    <header className="w-full bg-gray-800 shadow-md mb-8">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        {/* Logo atau Nama Aplikasi */}
        <div className="text-2xl font-bold text-white">📖 Tadabbur Quran</div>

        {/* Menu Navigasi */}
        <nav className="flex space-x-6">
          <Link
            href="/setoran/input-nama-santri"
            className="text-gray-300 hover:text-white transition"
          >
            Tambah Santri
          </Link>
          <Link
            href="/solat"
            className="text-gray-300 hover:text-white transition"
          >
            Jadwal Sholat
          </Link>
          <Link
            href="/juz"
            className="text-gray-300 hover:text-white transition"
          >
            Pilih Juz
          </Link>
          <Link
            href="/pilih-surat"
            className="text-gray-300 hover:text-white transition"
          >
            Pilih Surat
          </Link>
          <Link
            href="/tentang-kami"
            className="text-gray-300 hover:text-white transition"
          >
            Tentang Kami
          </Link>
        </nav>
      </div>
    </header>
  );
}
