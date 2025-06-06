import SuratPage from './components/SuratPage';

const Page = async ({ params }: any) => {
  const { surat_id } = await params;

  return <SuratPage surat_id={surat_id} />;
};

export default Page;
