import React from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { CardProps } from "./without-img"
import { Button } from '@/app/ui/components/Button';

export default function Card({
    country,
    title,
    description,
    tags = [],
    tagStyle,
    onButtonClick,
    href,
    viewCount = 0,
    backgroundImage,
    sdg = [],
    className,
    source = ''
}: CardProps) {

    return (
        <div className="absolute top-[136px] left-[948px] w-[413px] h-[600px] text-left bg-white">
            <div className="absolute h-[22.33%] w-[84.02%] top-[59.33%] right-[8.72%] bottom-[18.33%] left-[7.26%] flex flex-col items-start justify-start gap-5 font-desktop-paragraph">
                <b className="self-stretch relative leading-[30px] inline-block h-9 shrink-0">{title}</b>
                <div className="self-stretch relative text-lg leading-[26px]">{description}</div>
            </div>
            <b className="absolute w-[68.31%] top-[88.83%] left-[7.26%] text-lg leading-[22px] inline-block text-undp-blue">{viewCount} Items</b>
            <img className="absolute h-[54.33%] w-full top-[0%] right-[0%] bottom-[45.67%] left-[0%] max-w-full overflow-hidden max-h-full object-cover mix-blend-normal" alt="" src={backgroundImage} />
            <div className="absolute h-[54.33%] w-full top-[0%] right-[0%] bottom-[45.67%] left-[0%] [background:linear-gradient(173.09deg,_rgba(1,_141,_242,_0.35),_rgba(237,_255,_164,_0.35))] border-black border-[1px] border-solid box-border mix-blend-normal" />

            <Link href={href} className="absolute h-[11.83%] w-[17.43%] top-[84.83%] right-[5.08%] bottom-[3.33%] left-[77.48%] group">
                <div className="absolute h-[84.51%] w-[87.5%] top-[0%] right-[0%] bottom-[15.49%] left-[12.5%] bg-lime-yellow transition-all duration-300 group-hover:top-[15%] group-hover:left-[0.03%]" />
                <div className="absolute h-[84.51%] w-[87.5%] top-[15.49%] right-[12.5%] bottom-[0%] left-[0%] border-black border-[1px] border-solid box-border" />
                <img className="absolute h-[49.3%] w-[48.61%] top-[22.54%] right-[20.83%] bottom-[28.17%] left-[30.56%] max-w-full overflow-hidden max-h-full" alt="" src="images/Arrow.svg" />
            </Link>

            <div className="absolute top-[calc(50%_-_289px)] left-[calc(50%_+_122.5px)] rounded-[30px] bg-black flex flex-row items-center justify-center py-2 px-[19px] text-center text-sm text-white">
                <b className="relative leading-[18px]">{tags}</b>
            </div>
        </div>
    );
}
