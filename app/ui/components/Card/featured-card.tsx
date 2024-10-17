import React from 'react';
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
}: CardProps) {

    return (
        <div className={clsx("bg-white", className)}>
            <div className="self-stretch bg-white border-black border-t-[1px] border-solid flex flex-col items-start justify-start">
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
            </div>
        </div>
    );
}
