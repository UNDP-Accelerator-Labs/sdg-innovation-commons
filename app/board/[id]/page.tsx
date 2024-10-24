type Params = Promise<{ id: string }>

export default async function Page({ params }: { params: Params }) {  
  return (
    <>
    <h3>Coolection board</h3>
    </>
  );
}
