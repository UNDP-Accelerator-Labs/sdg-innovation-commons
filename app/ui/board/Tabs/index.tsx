import clsx from 'clsx';
import Link from 'next/link';

interface Props {
    id?: number;
    tabs: string[];
    platform: string;
}

export default async function Section({
    id,
    tabs,
    platform,
}: Props) {
    if(!tabs?.length) return <></>
    return (
        <>
        <nav className='tabs'>
            {
                tabs.map((d: string, i: number) => {
                    let txt: string = '';
                    if (d === 'all') txt = 'all items';
                    else txt = d;
                    return (
                        <div key={i} className={clsx('tab tab-line', platform === d ? 'font-bold' : 'yellow')}>
                            {/*<Link href={`/boards/${encodeURI(board)}/${id}?${windowParams.toString()}`}>*/}
                            <Link href={`/boards/${encodeURI(d)}/${id}`}>
                                {`${txt}${txt.slice(-1) === 's' ? '' : 's'}`}
                            </Link>
                        </div>
                    )
                })
            }
        </nav>
        </>
    )
}