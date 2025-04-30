import QuranJuz from './components/QuranJuz';


const Page = async ({ params }: any) => {
  const { juz_id } = await params;

  return <QuranJuz juz_id={juz_id} />;
};

export default Page;
