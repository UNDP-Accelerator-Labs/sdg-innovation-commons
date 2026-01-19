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
                            {isExternal ? ( <></>
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
        </div>
    </div>
    );
}
