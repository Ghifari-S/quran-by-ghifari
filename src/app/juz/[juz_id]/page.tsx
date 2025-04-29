import QuranPage from './components/QuranPage';

const Page = async ({ params }: any) => {
  const { juz_id } = await params;

  return <QuranPage juz_id={juz_id} />;
};

export default Page;
