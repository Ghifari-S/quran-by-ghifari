"use client"
import Link from "next/link";

import { useRouter } from "next/navigation";


const Nama = () => {
    const router = useRouter();

    const onClick = () => {
        router.push("/setoran/pilih-halaman")
    }
    return (
        <div>
            
            <p>halaman input nama santri</p>
            <button onClick={onClick}>pindah ke pilih halaman</button>
            <Link href="/">
                <span className="text-blue-500 underline">Kembali ke Home</span>
            </Link>
        </div>  
    )
}

export default Nama;
