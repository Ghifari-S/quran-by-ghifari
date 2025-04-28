import Link from "next/link";

const Nama = () => {
    return (
        <div>
            <p>halaman setoran</p>
            <Link href="/">
                <span className="text-blue-500 underline">Kembali ke Home</span>
            </Link>
        </div>  
    )
}

export default Nama;
