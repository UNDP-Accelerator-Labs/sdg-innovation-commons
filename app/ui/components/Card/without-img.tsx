import React from 'react';
import clsx from 'clsx';
import { CardLink } from '@/app/ui/components/Link';

export interface CardProps {
  id: number;
  country?: string | string[];
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
  tagStyleShade?: string;
}

export default function Card({
  id,
  country,
  date,
  title,
  description,
  tags,
  tagStyle,
  source,
  onButtonClick,
  href, 
  openInNewTab,
}: CardProps) {
  // Convert tagArr to an array if it's a string
  const tagArr = Array.isArray(tags) ? tags : [tags];

  return (
    <div className='card border-0 border-t-[1px] w-full relative flex flex-col'>
      {/* BAND WITH SOURCE NAME */}
      <div className={clsx('band w-full flex justify-between lg:text-[14px] !border-t-0', tagStyle)}>
          <span>{source}</span>
          <span>{date}</span>
      </div>
      {/* METADATA */}
      {/*<div className="flex flex-row items-start justify-between">
        <b className="relative text-undp-blue  font-space-mono">{country}</b>
        <b className="relative font-space-mono">{date}</b>
      </div>*/}
      {/* MAIN CONTENT */}
      <div className='content flex flex-col justify-between grow px-[20px] py-[20px]'>
        <div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        {/* TYPE INFO */}
        <div className="flex flex-row justify-between mt-[20px]">
          {/*<div className="flex flex-row gap-[20px]">
            {tagArr?.map((tag, index) => (
              <button
                key={index}
                className={clsx(
                  "chip capitalize",
                  tagStyle || "bg-light-blue"
                )}
                onClick={onButtonClick}
              >{tag}
              </button>
            ))}
          </div>*/}
          <button type='button' className="chip bg-black text-white">{country}</button>
          <CardLink
              href={href || '/'}
              openInNewTab={openInNewTab}
          />
        </div>
      </div>
    </div>
  );
}
