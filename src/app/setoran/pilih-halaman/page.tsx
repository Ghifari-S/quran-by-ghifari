"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function Search() {
  const searchParams = useSearchParams();
  const search = searchParams.get("santri");

  return (
    <div>
      <p>Santri-{search}</p>
      <p>halaman pilih surat</p>
      <Link href="/">
        <span className="text-blue-500 underline">Kembali ke Home</span>
      </Link>
    </div>
  );
}
