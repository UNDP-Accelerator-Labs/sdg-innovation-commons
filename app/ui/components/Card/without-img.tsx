import React from 'react';
import clsx from 'clsx';
import Link from 'next/link';

export interface CardProps {
  country?: string;
  title: string;
  description: string;
  tags?: string[];
  href: string;
  onButtonClick?: () => void;
  tagStyle?: string;
  viewCount?: number;
  backgroundImage?: string;
  sdg?: string | string[];
  className?: string;
  source?: string;
  date?: string;
}

export default function Card(_kwargs: CardProps) {
    let { country, date, title, description, tags, tagStyle, onButtonClick, href } = _kwargs
  // Convert tagArr to an array if it's a string
   const  tagArr = Array.isArray(tags) ? tags : [tags];

  return (
    <div className="w-full relative bg-white border-black border-t-[1px] border-solid box-border flex flex-col items-start justify-start pt-5 px-5 pb-10 gap-6 text-left text-smi text-undp-blue">
      <div className="self-stretch flex flex-col items-start justify-start gap-5">
        <div className="self-stretch flex flex-row items-start justify-between">
          <b className="relative leading-[15px] text-[13px] ">{country}</b>
          <b className="relative leading-[15px] text-black text-right text-[13px]">{date}</b>
        </div>
        <div className="self-stretch flex flex-col items-start justify-start gap-5 text-9xl text-black">
          <b className="self-stretch relative leading-[38px] lg:leading-[46px] text-[28px] lg:text-[36px]">{title}</b>
          <div className="self-stretch relative text-mini leading-[22px] text-[15px] lg:text-[16px]">
            {description}
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="self-stretch flex flex-row items-center justify-between text-center text-black">
        <div className="flex flex-row gap-2">
          {tagArr?.map((tag, index) => (
            <div
              key={index}
              className={clsx(
                "rounded-[30px] flex flex-row items-center justify-center py-2 px-[19px] cursor-pointer",
                tagStyle || "bg-light-blue" 
              )}
              onClick={onButtonClick}
            >
              <b className="relative leading-[15px] text-[13px] lg:text-[14px] capitalize">{tag}</b>
            </div>
          ))}
        </div>

        <Link href={href} className="w-[42.5px] relative h-[41.9px] group">
          <div className="absolute h-[84.49%] w-[87.53%] top-[0%] right-[-0.04%] bottom-[15.51%] left-[12.51%] bg-lime-yellow transition-all duration-300 group-hover:top-[15%] group-hover:left-[0.03%]" />
          <div className="absolute h-[84.49%] w-[87.53%] top-[15.5%] right-[12.47%] bottom-[0.01%] left-[0%] border-black border-[0.7px] border-solid box-border" />
          <img className="absolute h-[49.4%] w-[48.71%] top-[22.55%] right-[20.72%] bottom-[28.04%] left-[30.57%] max-w-full overflow-hidden max-h-full" alt="Arrow" src="images/Arrow.svg" />
        </Link>
      </div>
    </div>
  );
}
