import Link from "next/link";
import { FaArrowLeft, FaQuran, FaCheckCircle, FaEnvelope } from "react-icons/fa";

const Nama = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-cyan-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center text-emerald-600 mb-4">
            <FaQuran size={48} />
          </div>
          <h1 className="text-3xl font-bold text-emerald-800 mb-2">Tentang Kami</h1>
          <div className="w-24 h-1 bg-emerald-500 mx-auto"></div>
        </div>

        {/* Content Section */}
        <div className="space-y-6 text-gray-700">
          <p className="text-lg leading-relaxed">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Est sapiente
            ducimus hic consectetur cum qui tempora odit temporibus fugiat,
            reprehenderit eius at harum corrupti ipsum magnam facere voluptates
            illo rerum!
          </p>

          <div className="bg-emerald-50 p-6 rounded-lg border-l-4 border-emerald-500">
            <h3 className="text-xl font-semibold text-emerald-700 mb-4 flex items-center">
              <FaCheckCircle className="mr-2" /> Fitur dari aplikasi Kami
            </h3>
            <ul className="space-y-3">
              {[
                "bisa menyimpan data input",
                "bisa menampilkan dan menyimpan data dropdown",
                "mengganti background dengan klik suatu kata",
                "tombol berpindah halaman",
                "variabel yang bisa dipakai ketika dipanggil"
              ].map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="bg-emerald-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    {index + 1}
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-amber-50 p-6 rounded-lg border-l-4 border-amber-400">
            <p className="text-lg italic mb-4">
              Dan kami berharap semoga aplikasi kami ini bisa membantu para pengajar agar proses pembelajaran Al Qur'an dapat lebih maksimal
            </p>
            <div className="flex items-center text-amber-700">
              <FaEnvelope className="mr-2" />
              <span>Dan jika Anda memiliki saran dan masukan Anda bisa mengrimkannya ke <a href="mailto:contact@quranapp.com" className="font-medium underline">contact@quranapp.com</a></span>
            </div>
          </div>
        </div>

        {/* Footer Navigation - Menggunakan Opsi 1 (rekomendasi) */}
        <div className="mt-10 text-center">
          <Link 
            href="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 transition-colors duration-200"
          >
            <FaArrowLeft className="mr-2" /> Kembali ke Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Nama;