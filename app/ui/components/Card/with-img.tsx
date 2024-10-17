import React from 'react';
import clsx from 'clsx';
import { CardLink } from '@/app/ui/components/Link';

interface CardProps {
    country: string;
    title: string;
    description: string;
    tags?: string[];
    href?: string;
    onButtonClick?: () => void;
    tagStyle?: string;
    tagStyleShade?: string;
    viewCount?: number;
    backgroundImage?: string;
    sdg?: string | string[];
    className?: string;
    source?: string;
    openInNewTab?: boolean;
}

export default function Card({
    country,
    title,
    description,
    tags = [],
    tagStyle,
    tagStyleShade,
    onButtonClick,
    href,
    viewCount = 0,
    backgroundImage,
    sdg = [],
    className,
    source = '',
    openInNewTab = true
}: CardProps) {

    const tagArray = Array.isArray(tags) ? tags : [tags];
    const sdgArray = Array.isArray(sdg) ? sdg : [sdg];
    const visibleTags = tagArray?.slice(0, 4);
    const remainingTagsCount = tags.length - visibleTags.length;

    return (
        <div className={clsx("w-full relative flex flex-col items-start justify-start", className)}>
            <div className="w-full border-black border-[1px] border-solid box-border flex flex-col items-start justify-start grow">
                {/* Background Image */}
                <div className="self-stretch relative overflow-hidden shrink-0 flex flex-col items-start justify-start font-space-mono">
                    <div
                        className={clsx(
                            "self-stretch h-[245px] flex flex-col items-start justify-start bg-cover bg-no-repeat bg-[top]",
                            className
                        )}
                        style={{ backgroundImage: `url(${backgroundImage})` }}
                    >
                        <div className='absolute h-full w-full top-0 left-0 [background:linear-gradient(173.09deg,_rgba(1,_141,_242,_1),_rgba(237,_255,_164,_1))] opacity-[.5]' />
                        <div className="self-stretch flex flex-row items-center justify-end pt-4 pb-0 pl-0 pr-4 gap-[11px] z-[2]">
                            {/* SDG */}
                            <div className="rounded-11xl bg-white flex flex-row items-center justify-center py-2 px-[19px]">
                                <b className="relative leading-[15px]">{sdgArray.join(', ')}</b>
                            </div>
                            {/* Country */}
                            <div className="rounded-11xl bg-black flex flex-row items-center justify-center py-2 px-[19px] text-white">
                                <b className="relative leading-[15px]">{country}</b>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Experiment Label */}
                <div className={clsx("self-stretch border-black border-t-[1px] border-solid flex flex-row items-center justify-start py-2.5 px-5 font-space-mono", tagStyle)}>
                    <b className="relative leading-[15px] capitalize">{source}</b>
                </div>
                {/* Content */}
                <div className="self-stretch border-black border-t-[1px] border-solid flex flex-col pt-5 gap-6 justify-between grow">
                    <div className="self-stretch flex flex-col items-start justify-start">
                        <div className="self-stretch flex flex-col items-start justify-start gap-2.5 py-2.5 px-5">
                            {/* Title */}
                            <b className="self-stretch relative leading-[26px] text-lg lg:text-xl">{title}</b>
                            {/* Description */}
                            <div className="self-stretch relative text-mini lg:text-base leading-[22px]">
                                {description}
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="hidden lg:flex flex-row items-end justify-start flex-wrap content-end gap-1.5 text-center text-sm py-2.5 px-5">
                            {/* Render the first 4 tags */}
                            {visibleTags?.map((tag: string, index: number) => (
                                <div
                                    key={index}
                                    className={clsx("rounded-11xl flex flex-row items-center justify-center py-2 px-[19px] font-space-mono", tagStyleShade )}
                                >
                                    <b className="relative leading-[18px] capitalize ">{tag}</b>
                                </div>
                            ))}

                            {/* If there are more than 4 tags, display the +n logic */}
                            {remainingTagsCount > 0 && (
                                <div className={clsx("rounded-11xl flex flex-row items-center justify-center py-2 px-[19px]", tagStyleShade )}>
                                    <b className="relative leading-[18px]">+{remainingTagsCount}</b>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="self-stretch flex flex-row items-center justify-between text-sm py-2.5 px-5">
                            <div className="flex flex-row items-start justify-start gap-1">
                                {/* View Count */}
                                <img className="w-[20.2px] relative h-[17.3px]" alt="Views" src="images/heart.svg" />
                                <b className="w-[52px] relative leading-[18px] inline-block shrink-0">{viewCount}</b>
                            </div>
                            {/* Arrow */}
                            <CardLink
                                href={href || '/'}
                                openInNewTab={openInNewTab}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
