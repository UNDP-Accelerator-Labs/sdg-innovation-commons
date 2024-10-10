import React from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { CardProps } from "./without-img"

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
        <div className="w-full relative h-[600px] text-left text-3xl text-black font-desktop-labels">
            <img className="absolute h-[45.83%] w-full top-[54.17%] right-[0%] bottom-[0%] left-[0%] max-w-full overflow-hidden max-h-full" alt="" src="Rectangle 61.svg" />
            <div className="absolute h-[22.33%] w-[84.02%] top-[59.33%] right-[8.72%] bottom-[18.33%] left-[7.26%] flex flex-col items-start justify-start gap-5 font-desktop-paragraph">
                <b className="self-stretch relative leading-[30px] inline-block h-9 shrink-0">Board Name Lorem</b>
                <div className="self-stretch relative text-lg leading-[26px]">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ut accumsan diam adipiscing elit.</div>
            </div>
            <b className="absolute w-[68.31%] top-[88.83%] left-[7.26%] text-lg leading-[22px] inline-block text-undp-blue">145 Items</b>
            <img className="absolute h-[54.33%] w-full top-[0%] right-[0%] bottom-[45.67%] left-[0%] max-w-full overflow-hidden max-h-full object-cover mix-blend-normal" alt="" src="Rectangle 68.png" />
            <div className="absolute h-[54.33%] w-full top-[0%] right-[0%] bottom-[45.67%] left-[0%] [background:linear-gradient(173.09deg,_rgba(1,_141,_242,_0.35),_rgba(237,_255,_164,_0.35))] border-black border-[1px] border-solid box-border mix-blend-normal" />
            <div className="absolute h-[11.83%] w-[17.43%] top-[84.83%] right-[5.08%] bottom-[3.33%] left-[77.48%]">
                <div className="absolute h-[84.51%] w-[87.5%] top-[0%] right-[0%] bottom-[15.49%] left-[12.5%] bg-lime-yellow" />
                <div className="absolute h-[84.51%] w-[87.5%] top-[15.49%] right-[12.5%] bottom-[0%] left-[0%] border-black border-[1px] border-solid box-border" />
                <img className="absolute h-[49.3%] w-[48.61%] top-[22.54%] right-[20.83%] bottom-[28.17%] left-[30.56%] max-w-full overflow-hidden max-h-full" alt="" src="Arrow.svg" />
            </div>
            <div className="absolute top-[calc(50%_-_289px)] left-[calc(50%_+_122.5px)] rounded-[30px] bg-black flex flex-row items-center justify-center py-2 px-[19px] text-center text-sm text-white">
                <b className="relative leading-[18px]">SIDS</b>
            </div>
        </div>
    );
}
