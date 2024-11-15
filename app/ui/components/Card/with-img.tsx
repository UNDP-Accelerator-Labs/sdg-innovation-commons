import React from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { Button } from '@/app/ui/components/Button';

interface CardProps {
    link?: string;
    country: string;
    title: string;
    description: string;
    tags?: string[];
    href?: string;
    onButtonClick?: () => void;
    tagStyle?: string;
    tagStyleShade?: string;
    viewCount?: number;
    backgroundImage?: string;
    sdg?: string | string[];
    className?: string;
    source?: string;
    openInNewTab?: boolean;
    date?: string;
    engagement?: any[];
}

export default function Card({
    link,
    country,
    title,
    description,
    tags = [],
    tagStyle,
    tagStyleShade,
    onButtonClick,
    href,
    viewCount = 0,
    backgroundImage,
    sdg = [],
    className,
    source = '',
    openInNewTab = true,
    date = '',
    engagement,
}: CardProps) {

    const tagArray = Array.isArray(tags) ? tags : [tags];
    const sdgArray = Array.isArray(sdg) ? sdg : [sdg];
    const visibleTags = tagArray?.slice(0, 4);
    const remainingTagsCount = tags.length - visibleTags.length;

    const likes: number = engagement.find((d: any) => d.type === 'like')?.count ?? 0;
    const dislikes: number = engagement.find((d: any) => d.type === 'dislike')?.count ?? 0;
    const comments: number = engagement.find((d: any) => d.type === 'comment')?.count ?? 0;

    return (
        <div className={clsx('card w-full relative flex flex-col', className)}>
            {/* TOP (IMAGE AND CHIPS) */}
            {backgroundImage ? (
                <div className='w-full'>
                    {/* Background Image */}
                    <div className='relative'>
                        <div className={clsx(
                                "self-stretch h-[245px] flex flex-col items-start justify-start bg-cover bg-no-repeat bg-[top]",
                                className
                            )}
                            style={{ backgroundImage: `url(${backgroundImage})` }}
                        >
                            <div className='absolute h-full w-full top-0 left-0 [background:linear-gradient(173.09deg,_rgba(1,_141,_242,_1),_rgba(237,_255,_164,_1))] opacity-[.5]'></div>
                        </div>
                    </div>
                    {/* Chips */}
                    <div className='chips-container absolute top-0 w-full'>
                        <div className='flex flex-row items-center justify-end pt-[20px] pb-0 pl-0 pr-[20px] gap-[10px] z-[2]'>
                            {/* SDG */}
                            <button type='button' className="chip bg-white">{sdgArray.join(', ')}</button>
                            {/* Country */}
                            <button type='button' className="chip bg-black text-white">{country}</button>
                        </div>
                    </div>
                </div>
            ) : null}
            {/* BAND WITH SOURCE NAME */}
            <div className={clsx('band w-full lg:text-[14px]', !backgroundImage ? '!border-t-0' : '', tagStyle)}>
                <div className='flex justify-between'>
                    <span>{source}</span>
                    <span>{date}</span>
                </div>
            </div>
            {/* MAIN CONTENT */}
            <div className='content flex flex-col justify-between grow px-[20px] py-[20px]'>
                <div>
                    {!backgroundImage ? (
                        <div className='chips-container w-full'>
                            <div className='flex flex-row items-center justify-end py-0 pl-0 gap-[10px] z-[2]'>
                                {/* SDG */}
                                <button type='button' className="chip bg-white border">{sdgArray.join(', ')}</button>
                                {/* Country */}
                                <button type='button' className="chip bg-black text-white">{country}</button>
                            </div>
                        </div>
                    ) : null}
                    {/* Title */}
                    <Link href={`${link}`}>
                        <h1>{title}</h1>
                    </Link>
                    {/* Description */}
                    <p>{description}</p>
                </div>
                <div>
                    <div className="hidden lg:flex flex-row items-end justify-start flex-wrap content-end gap-1.5 text-center text-sm pb-[20px]">
                        {/* Render the first 4 tags */}
                        {visibleTags?.map((tag: string, index: number) => (
                            <button
                                type='button'
                                key={index}
                                className={clsx('chip capitalize', tagStyleShade )}
                            >{tag}
                            </button>
                        ))}

                        {/* If there are more than 4 tags, display the +n logic */}
                        {remainingTagsCount > 0 && (
                            <div className={clsx("rounded-11xl flex flex-row items-center justify-center py-2 px-[20px]", tagStyleShade )}>
                                <b className="relative leading-[18px]">+{remainingTagsCount}</b>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="self-stretch flex flex-row items-center justify-between text-sm mb-[10px]">
                        <div className="flex flex-row items-start justify-start">
                            <img className="w-[20px] relative" alt="Likes" src="/images/thumb-up.svg" />
                            <p className="font-space-mono ml-[5px] mb-0"><b>{likes}</b></p>
                        </div>
                        <div className="flex flex-row items-start justify-start">
                            <img className="w-[20px] mt-[5px] relative" alt="Dislikes" src="/images/thumb-down.svg" />
                            <p className="font-space-mono ml-[5px] mb-0"><b>{dislikes}</b></p>
                        </div>
                        <div className="flex flex-row items-start justify-start">
                            <img className="w-[20px] mt-[5px] relative" alt="Comments" src="/images/comment.svg" />
                            <p className="font-space-mono ml-[5px] mb-0"><b>{comments}</b></p>
                        </div>
                        <button className="w-[40px] h-[40px] border-solid border-black border-[1px] bg-[transparent]">
                            <img className="w-[20px] mt-[5px] relative" alt="Download" src="/images/download.svg" />
                        </button>

                        {/* Arrow */}
                        {/*<Link
                            href={href || '/'}
                            openInNewTab={openInNewTab}
                            className='detach'
                        >
                            Add to Board
                        </Link>*/}
                        <Button type='button' className='border-l-0 grow-0 !text-[14px] !h-[40px]'>
                            Add to Board
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
