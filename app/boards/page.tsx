import Hero from './Hero';
import Navbar from '@/app/ui/components/Navbar';
import { get_all_collections } from '@/app/lib/data/collections';

export default async function Page() {
    const data = await get_all_collections({})
    console.log(data)
  return (
    <>
      <Navbar />
      <Hero />
    </>
  );
}
