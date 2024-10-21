import { get_collection } from '@/app/lib/data/collections';

export default async function Page({ params }: { params: { id: string } }) {
    const id = +params.id;
    const data = await get_collection({id})
    console.log(data)
  return (
    <>
    <h3>Coolection board</h3>
    </>
  );
}
