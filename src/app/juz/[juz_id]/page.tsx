import QuranPage from './components/QuranPage';

const Page = async ({ params }: any) => {
  const { surat_id } = await params;

  return <QuranPage surat_id={surat_id} />;
};

export default Page;
