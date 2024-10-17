import React from 'react';
import clsx from 'clsx';
import { CardLink } from '@/app/ui/components/Link';

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
  openInNewTab?: boolean;
}

export default function Card(_kwargs: CardProps) {
  let { country, date, title, description, tags, tagStyle, onButtonClick, href, openInNewTab } = _kwargs
  // Convert tagArr to an array if it's a string
  const tagArr = Array.isArray(tags) ? tags : [tags];

  return (
    <div className="card w-full relative bg-white border-black border-t-[1px] border-solid box-border flex flex-col items-between justify-start pt-5 px-5 pb-10 gap-6 text-left text-smi text-undp-blue">
      <div className="self-stretch flex flex-col items-start justify-start gap-5">
        <div className="self-stretch flex flex-row items-start justify-between">
          <b className="relative leading-[15px] text-[13px] font-space-mono">{country}</b>
          <b className="relative leading-[15px] text-black text-right text-[13px] font-space-mono">{date}</b>
        </div>
        <div className="self-stretch flex flex-col items-start justify-start gap-5 text-9xl text-black">
          <h1>{title}</h1>
          <div className="self-stretch relative text-mini leading-[22px] lg:text-[16px]">
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
              <b className="relative leading-[15px] text-[13px] lg:text-[14px] capitalize font-space-mono">{tag}</b>
            </div>
          ))}
        </div>

        <CardLink
            className="w-[42.5px] relative h-[41.9px]"
            href={href || '/'}
            openInNewTab={openInNewTab}
        />
      </div>
    </div>
  );
}
