import QuranPage from './components/QuranPage';

const Page = async ({ params }: any) => {
  const { page_no } = await params;

  return <QuranPage surat_id={page_no} />;
};

export default Page;
