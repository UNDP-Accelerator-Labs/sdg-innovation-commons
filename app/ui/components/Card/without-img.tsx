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
    <div className="card w-full relative flex flex-col px-[20px] py-[20px] justify-between">
      {/* METADATA */}
      <div className="flex flex-row items-start justify-between">
        <b className="relative text-undp-blue  font-space-mono">{country}</b>
        <b className="relative font-space-mono">{date}</b>
      </div>
      {/* MAIN CONTENT */}
      <div className='content'>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {/* TYPE INFO */}
      <div className="flex flex-row justify-between mt-[20px]">
        <div className="flex flex-row gap-[20px]">
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
        </div>

        <CardLink
            href={href || '/'}
            openInNewTab={openInNewTab}
        />
      </div>
    </div>
  );
}
