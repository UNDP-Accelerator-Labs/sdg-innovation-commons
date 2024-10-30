import React from 'react';
import clsx from 'clsx';
import { CardLink } from '@/app/ui/components/Link';

interface CardProps {
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
}

export default function Card({
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
    date = ''
}: CardProps) {

    const tagArray = Array.isArray(tags) ? tags : [tags];
    const sdgArray = Array.isArray(sdg) ? sdg : [sdg];
    const visibleTags = tagArray?.slice(0, 4);
    const remainingTagsCount = tags.length - visibleTags.length;

    return (
        <div className={clsx('card w-full relative flex flex-col', className)}>
            {/* TOP (IMAGE AND CHIPS) */}
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
            {/* BAND WITH SOURCE NAME */}
            <div className={clsx('band w-full flex justify-between lg:text-[14px]', tagStyle)}>
                <span>{source}</span>
                <span>{date}</span>
            </div>
            {/* MAIN CONTENT */}
            <div className='content flex flex-col justify-between grow px-[20px] py-[20px]'>
                <div>
                    {/* Title */}
                    <h1>{title}</h1>
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
                        <div className="flex flex-row items-start justify-start gap-1">
                            {/* View Count */}
                            <img className="w-[20.2px] relative h-[17.3px]" alt="Views" src="/images/heart.svg" />
                            <b className="w-[52px] relative leading-[18px] inline-block shrink-0">{viewCount}</b>
                        </div>
                        {/* Arrow */}
                        <CardLink
                            href={href || '/'}
                            openInNewTab={openInNewTab}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
