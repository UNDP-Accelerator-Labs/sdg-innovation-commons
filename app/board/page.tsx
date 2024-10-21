import { get_all_collections } from '@/app/lib/data/collections';

export default async function Page() {
    const data = await get_all_collections({})
    console.log(data)
  return (
    <>
    <h3>All board</h3>
    </>
  );
}
