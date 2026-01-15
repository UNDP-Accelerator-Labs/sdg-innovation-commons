'use client';
import { useRef, useEffect } from 'react';
import clsx from 'clsx';
import Link from '@/app/ui/components/Link';
import { CardLink } from '@/app/ui/components/Link/card';
import { CardProps } from "./without-img"

export default function Card({
    title,
    description,
    tags = [],
    href,
    viewCount = 0,
    backgroundImage,
    className,
    openInNewTab,
    isExternal = false,
    tagStyleShade
}: CardProps) {

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current) ref.current.innerHTML = description ? description.replace(/\n+/g, '<br/>') : '';
    }, [ref]);

    return (
    <div className={clsx('board w-full relative flex', className)}>
        <div className='card grow flex flex-col z-[1]'>
            {/* TOP (IMAGE AND CHIPS) */}
            {backgroundImage ? (
                <div className='w-full'>
                    {/* Background Image */}
                    <div className='relative'>
                        <div className={clsx(
                                "self-stretch h-[245px] flex flex-col items-start justify-start bg-cover bg-no-repeat bg-[top]",
                                className
                            )}
                            style={{ backgroundImage: `url("${backgroundImage}")` }}
                        >
                            <div className='absolute h-full w-full top-0 left-0 [background:linear-gradient(173.09deg,_rgba(1,_141,_242,_1),_rgba(237,_255,_164,_1))] opacity-[.5]'></div>
                        </div>
                    </div>
                    {/* Chips */}
                    <div className='chips-container absolute top-0 w-full'>
                        <div className='flex flex-row items-center justify-end pt-[20px] pb-0 pl-0 pr-[20px] gap-[10px] z-[2]'>
                            {/* Country */}
                            {/*<button type='button' className="chip bg-black text-white">{country}</button>*/}
                        </div>
                    </div>
                </div>
            ) : null}
            {/* MAIN CONTENT */}
            <div className='content flex flex-col justify-between grow px-[20px] py-[20px]'>
                <div>
                    {/* Title */}
                    <Link href={href || '/'} passHref openInNewTab={isExternal || openInNewTab}>
                        <div className="flex items-center gap-2">
                            <h1 className="flex-1">{title}</h1>
                            {isExternal && (
                                <svg 
                                    className="w-5 h-5 flex-shrink-0" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                                    />
                                </svg>
                            )}
                        </div>
                    </Link>
                    {/* Description */}
                    <p ref={ref}>{description}</p>
                </div>
                <div>
                    {/* Footer */}
                    <div className="self-stretch flex flex-row items-center justify-between text-sm mb-[10px]">
                        <div className="flex flex-row items-end justify-start gap-1">
                            {/* View Count or External indicator */}
                            {isExternal ? (
                                <>
                                    <svg 
                                        className="w-[30px] h-[30px]" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" 
                                        />
                                    </svg>
                                    <p className="font-space-mono ml-[10px] mb-0"><b>External Resource</b></p>
                                </>
                            ) : (
                                <>
                                    <img className="w-[30px] relative" alt="Views" src="/images/board-cards.svg" />
                                    <p className="font-space-mono ml-[10px] mb-0"><b>{viewCount} Item{viewCount !== 1 ? 's' : null}</b></p>
                                </>
                            )}
                        </div>
                        {/* Arrow */}
                        <CardLink
                            href={href || '/'}
                            openInNewTab={isExternal || openInNewTab}
                        />
                    </div>
                </div>
            </div>

            {/*<div className="self-stretch bg-white border-black border-t-[1px] border-solid flex flex-col items-start justify-start">
                <div className="self-stretch border-black border-t-[1px] border-solid flex flex-col items-start justify-start p-5 gap-5">
                    <div className="self-stretch flex flex-col items-start justify-start lg:hidden">
                        <div className="self-stretch flex flex-col items-start justify-start gap-2.5">
                            <b className="self-stretch relative leading-[26px] text-lg "> {title}</b>
                            <div className="self-stretch relative text-mini leading-[22px] [display:-webkit-inline-box] overflow-hidden text-ellipsis [-webkit-line-clamp:2] [-webkit-box-orient:vertical] ">{description}</div>
                        </div>
                    </div>
                    <div className="hidden absolute h-[22.33%] w-[84.02%] top-[59.33%] right-[8.72%] bottom-[18.33%] left-[7.26%] lg:flex flex-col items-start justify-start gap-5">
                        <b className="self-stretch relative leading-[30px] inline-block h-9 shrink-0">{title}</b>
                        <div className="self-stretch relative text-lg leading-[26px]">{description}</div>
                    </div>
                    <div className="self-stretch flex flex-row items-end justify-between text-sm text-undp-blue">
                        <div className="flex flex-row items-start justify-start lg:hidden">
                            <b className="relative leading-[18px] text-sm "> {viewCount} Items</b>
                        </div>
                        <b className="hidden lg:inline-block absolute w-[68.31%] top-[88.83%] left-[7.26%] text-lg leading-[22px] text-undp-blue">{viewCount} Items</b>
                        <img className="hidden lg:flex absolute h-[54.33%] w-full top-[0%] right-[0%] bottom-[45.67%] left-[0%] max-w-full overflow-hidden max-h-full object-cover mix-blend-normal" alt="" src={backgroundImage} />
                        <div className="hidden lg:flex absolute h-[54.33%] w-full top-[0%] right-[0%] bottom-[45.67%] left-[0%] [background:linear-gradient(173.09deg,_rgba(1,_141,_242,_0.35),_rgba(237,_255,_164,_0.35))] border-black border-[1px] border-solid box-border mix-blend-normal" />

                        <CardLink
                            href={href || '/'}
                        />
                    </div>
                </div>
            </div>
            <div className="hidden lg:flex absolute top-[calc(50%_-_289px)] left-[calc(50%_+_105.5px)] rounded-[30px] bg-black flex-row items-center justify-center py-2 px-[19px] text-center text-sm text-white">
                <b className="relative leading-[18px]">{tags}</b>
            </div>*/}
        </div>
    </div>
    );
}
