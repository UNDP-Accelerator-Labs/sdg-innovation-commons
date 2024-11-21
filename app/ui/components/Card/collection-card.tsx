'use client';
import { useRef, useEffect } from 'react';
import clsx from 'clsx';
import { CardLink } from '@/app/ui/components/Link';
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
    tagStyleShade
}: CardProps) {

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current) ref.current.innerHTML = description ? description.replace(/\n+/g, '<br/>') : '';
    }, [ref]);

    return (
    <div className={clsx('w-full relative flex', className)}>
        <div className='card grow flex flex-col !bg-transparent !border-none'>
            {/* TOP (IMAGE AND CHIPS) */}
            {backgroundImage ? (
                <div className='w-full'>
                    <div className='folder'>
                        <div className='folder-label'>
                            <span>{viewCount} Board{viewCount !== 1 ? 's' : null}</span>
                        </div>
                        <div className='folder-base'></div>
                    </div>

                    {/* Background Image */}
                    <div className='relative border-[1px] border-solid'>
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
                    {/*<div className='chips-container absolute top-0 w-full'>
                        <div className='flex flex-row items-center justify-end pt-[20px] pb-0 pl-0 pr-[20px] gap-[10px] z-[2]'>
                             Country 
                            <button type='button' className="chip bg-black text-white">{country}</button>
                        </div>
                    </div>*/}
                </div>
            ) : null}
            {/* MAIN CONTENT */}
            <div className='content flex flex-row justify-between items-center px-[20px] bg-white border-l-[1px] border-r-[1px] border-b-[1px] border-solid'>

                    {/* Title */}
                    <h1>{title.length > 25 ? `${title.slice(0, 25)}…` : title}</h1>
                    {/* Arrow */}
                    <CardLink
                        href={href || '/'}
                        openInNewTab={openInNewTab}
                    />
            </div>
        </div>
    </div>
    );
}
