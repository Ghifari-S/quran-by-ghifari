import { Suspense } from "react";
import Search from "./search";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-white text-center mt-10">Loading halaman...</div>}>
      <Search />
    </Suspense>
  );
}
