import SuratPage from './components/SuratPage';

interface props {
  params: { surat_id: string };
}

const Page = ({ params }: props) => {
  return <SuratPage surat_id={params.surat_id} />;
};

export async function generateStaticParams() {
  return Array.from({ length: 114 }, (_, i) => ({ surat: (i + 1).toString() }));
}

export default Page;
