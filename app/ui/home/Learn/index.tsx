import { Button } from '@/app/ui/components/Button';
import Card from '@/app/ui/components/Card/without-img';
import Link from 'next/link';
import learnApi from '@/app/lib/data/learn';
import { formatDate } from '@/app/lib/utils';
import { PostProps } from '@/app/lib/definitions';

export default async function Section() {
    const data = await learnApi({ limit: 10, search: 'What has the network learnt?' });
    let { hits } = data || {};

    function processHits(hits: PostProps[]): PostProps[] {
        // Filter to remove duplicates based on the 'url' or 'title' property
        const uniqueHits = hits?.filter(
            (item, index, self) =>
                index === self.findIndex(
                    (t) => t.url === item.url || t.title === item.title
                )
        );

        // Return only the first 4 items
        return uniqueHits.slice(0, 4);
    }

    hits = processHits(hits);

    return (
        <>
            <hr className="border border-black border-1 w-full" />
            <div className="w-full grid-background relative flex flex-col items-start justify-start py-10 px-5 box-border gap-[30px] text-left text-smi text-black font-mobile-buttons z[1]">
                <div className="lg:w-full lg:relative lg:flex lg:flex-row lg:items-start lg:justify-start lg:py-0 lg:px-20 lg:box-border lg:gap-[357px] lg:text-left text-17xl text-black">
                    <div className="flex flex-col items-start justify-start relative text-9xl">
                        <img
                            className="w-[234.1px] lg:w-[292.2px] absolute !m-[0] top-[23.17px] left-[-7.5px] h-[26px] z-[0]"
                            alt="Icon"
                            src="images/Rectangle 89.svg"
                        />
                        <b className="relative leading-[38px] z-[1] text-[28px] lg:text-[36px]">What We Learn</b>
                    </div>
                    <div className="lg:flex-1 lg:flex lg:flex-col lg:items-start lg:justify-start lg:gap-10 lg:text-3xl mt-5 lg:mt-0">
                        <b className="self-stretch relative text-2xl leading-[28px] text-[21px] lg:text-[22px]">
                            Browse through our blogs, publications, and toolkits to learn what works and what doesn’t in sustainable development.
                        </b>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5 lg:py-0 lg:px-20 lg:gap-[45px] lg:ml-[15%] lg:mt-[5%] ">
                    {hits?.map((post: any) => (
                        <Card
                            key={post.doc_id}
                            country={post?.meta?.iso3[0] === 'NUL' || !post?.meta?.iso3[0] ? 'Global' : post?.meta?.iso3[0]}
                            date={formatDate(post?.meta?.date) || ''}
                            title={post?.title || ''}
                            description={`${post?.snippets} ${post?.snippets?.length ? '...' : ''}`}
                            tagArr={post?.base || ''}
                            tagStyle='bg-light-blue'
                            href={post?.url}
                        />
                    ))}
                </div>
                <div className="self-stretch flex flex-col items-end justify-start text-center text-sm">
                    <Button>
                        <Link href={'/learn'}>
                            Read All
                        </Link>
                    </Button>
                </div>
            </div>
        </>
    );
}
