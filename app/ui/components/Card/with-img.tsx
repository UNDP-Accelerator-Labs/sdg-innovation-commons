'use client';
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation'
import platformApi, { engageApi, pin } from '@/app/lib/data/platform-api';
import Notification from '@/app/ui/components/Notification';
import { Button } from '@/app/ui/components/Button';
import AddToBoard from '@/app/ui/components/Modal/add-to-board';
import { engage, handleShowNotification, handleBoard, removeFromBoardApi } from './utils'
import { useSharedState } from '@/app/ui/components/SharedState/Context';

export interface BoardInfo {
    boards?: any[];
    removeFromBoard?: boolean;
    boardId?: number;
    articleType?: string;
    isContributor?: boolean;
}

interface CardProps {
    id: number;
    country: string | string[];
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
    date?: string;
    engagement?: any[];
    data?: any;
    isLogedIn: boolean;
    boardInfo?: BoardInfo
}

export default function Card({
    id,
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
    openInNewTab = true,
    date = '',
    engagement,
    data,
    isLogedIn,
    boardInfo
}: CardProps) {

    const { pinboards, current_user_engagement } = data || {}
    const pathname = usePathname();
    const { boards, removeFromBoard, boardId, isContributor } = boardInfo || {};
    const [hrefs, setHref] = useState<string>('');
    const hasEngagement = (type: string) =>
        !!current_user_engagement?.some((p: any) => p.type === type);

    const [isLiked, setIsLiked] = useState<boolean>(hasEngagement('like'));
    const [isDisliked, setIsDisliked] = useState<boolean>(hasEngagement('dislike'));

    const tagArray = tags ? (Array.isArray(tags) ? tags : [tags]) : '';
    const sdgArray = sdg ? (Array.isArray(sdg) ? sdg : [sdg]) : '';
    const visibleTags = Array.isArray(tagArray) ? tagArray?.slice(0, 4) : [];
    const remainingTagsCount = tags.length - visibleTags.length;

    let likes: number = engagement?.find((d: any) => d.type === 'like')?.count ?? 0;
    let dislikes: number = engagement?.find((d: any) => d.type === 'dislike')?.count ?? 0;
    const comments: number = engagement?.find((d: any) => d.type === 'comment')?.count ?? 0;

    const [likeCounts, setLikeCounts] = useState<number>(likes);
    const [dislikeCounts, setDislikeCounts] = useState<number>(dislikes);

    //Notification DOM states
    const [showNotification, setShowNotification] = useState(false);
    const [message, setMessage] = useState<string>("Action Required!");
    const [submessage, setSubMessage] = useState<string>("You need to log in to engage with this post.");
    const [messageType, setMessageType] = useState<string>("warning");

    const [isModalOpen, setModalOpen] = useState<boolean>(false);


    const redirectUser = (pathname: string) => {
        window.history.replaceState(null, '', pathname);
        window.location.reload();
    };
    
    type EngagementType = 'like' | 'dislike';
    type ActionType = 'delete' | 'insert';

    const handleEngage = async (action: ActionType, type: EngagementType) => {
        return engage(
            action,
            type,
            source,
            id,
            isLogedIn,
            engageApi,
            setIsLiked,
            setIsDisliked,
            likeCounts,
            setLikeCounts,
            dislikeCounts,
            setDislikeCounts,
            () => handleShowNotification(setShowNotification)
        )
    };


    const handleBoardFn = (action: ActionType) => {
        return handleBoard(
            isLogedIn,
            removeFromBoard as boolean,
            setModalOpen,
            () => handleShowNotification(setShowNotification),
            action => removeFromBoardApi(
                action,
                boardId as number,
                id,
                source,
                pin,
                setMessage,
                setMessageType,
                setSubMessage,
                setShowNotification,
                () => redirectUser(pathname),
                setModalOpen
            )

        );

    }

    useEffect(() => {
        const fetchHref = async () => {
            const url = await platformApi({ render: true, action: 'download', pads: [id] }, source, 'pads', true);
            setHref(url);
        };
        fetchHref();
    }, []);


    const { sharedState } = useSharedState();
    const { session } = sharedState || {}
    const [isDisabled, setIsDisabled] = useState<boolean>(false);

    useEffect(() => {
        let d = session?.rights > 2 ? false : removeFromBoard && !isContributor ? true : false 
        setIsDisabled(d);
      }, [session]);
      
    return (
        <div className={clsx('card w-full relative flex flex-col', className)}>
            {/* TOP (IMAGE AND CHIPS) */}
            {backgroundImage ? (
                <div className='w-full'>
                    {/* Background Image */}
                    <div className='relative'>
                        <div className={clsx(
                            "self-stretch h-[245px] flex flex-col items-start justify-start bg-cover bg-no-repeat bg-[top]",
                            className
                        )}
                            style={{ backgroundImage: `url(${backgroundImage})` }}
                        >
                            <div className='absolute h-full w-full top-0 left-0 [background:linear-gradient(173.09deg,_rgba(1,_141,_242,_1),_rgba(237,_255,_164,_1))] opacity-[.5]'></div>
                        </div>
                    </div>
                    {/* Chips */}
                    <div className='chips-container absolute top-0 w-full'>
                        <div className='flex flex-row items-center justify-end flex-wrap pt-[20px] pb-0 pl-0 pr-[20px] gap-[10px] z-[2]'>
                            {/* SDG */}
                            {Array.isArray(sdgArray) && sdgArray.length ? <button type='button' className="chip bg-white">{sdgArray.join(', ')}</button> : ''}
                            {/* Country */}
                            {Array.isArray(country) ?
                                country.map((d: string, i: number) => (
                                    <button key={i} type='button' className="chip bg-black text-white">{d}</button>
                                ))
                                : (
                                    <button type='button' className="chip bg-black text-white">{country}</button>
                                )}
                        </div>
                    </div>
                </div>
            ) : null}
            {/* BAND WITH SOURCE NAME */}
            <div className={clsx('band w-full lg:text-[14px]', !backgroundImage ? '!border-t-0' : '', tagStyle)}>
                <div className='flex justify-between'>
                    <span>{source}</span>
                    <span>{date}</span>
                </div>
            </div>
            {/* MAIN CONTENT */}
            <div className='content flex flex-col justify-between grow px-[20px] py-[20px]'>
                <div>
                    {!backgroundImage ? (
                        <div className='chips-container w-full'>
                            <div className='flex flex-row flex-wrap items-center justify-end py-0 pl-0 gap-[10px] z-[2]'>
                                {/* SDG */}
                                {Array.isArray(sdgArray) && sdgArray?.length ? <button type='button' className="chip bg-white border">{sdgArray.join(', ')}</button> : ''}
                                {/* Country */}
                                {Array.isArray(country) ?
                                    country.map((d: string, i: number) => (
                                        <button key={i} type='button' className="chip bg-black text-white">{d}</button>
                                    ))
                                    : (
                                        <button type='button' className="chip bg-black text-white">{country}</button>
                                    )}
                            </div>
                        </div>
                    ) : null}
                    {/* Title */}
                    <Link href={`/pads/${source}/${id}`}>
                        <h1>{title}</h1>
                    </Link>
                    {/* Description */}
                    <p>{description}</p>
                </div>
                <div>
                    <div className="hidden lg:flex flex-row items-end justify-start flex-wrap content-end gap-1.5 text-center text-sm pb-[20px]">
                        {/* Render the first 4 tags */}
                        {visibleTags?.map((tag: string, i: number) => (
                            <button
                                type='button'
                                key={i}
                                className={clsx('chip capitalize', tagStyleShade)}
                            >{tag}
                            </button>
                        ))}

                        {/* If there are more than 4 tags, display the +n logic */}
                        {remainingTagsCount > 0 && (
                            <div className={clsx("rounded-11xl flex flex-row items-center justify-center py-2 px-[20px]", tagStyleShade)}>
                                <b className="relative leading-[18px]">+{remainingTagsCount}</b>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="self-stretch flex flex-row items-center justify-between text-sm mb-[10px] gap-1">
                        <div className="flex flex-row items-start">
                            <button onClick={() => handleEngage(isLiked ? 'delete' : 'insert', 'like')} className={clsx(
                                'flex flex-row items-start justify-start bg-inherit hover:text-light-green',
                                isLiked ? 'text-red-300' : ''
                            )}  >
                                <svg width="21" height="21" viewBox="0 0 21 21" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3.41018 20.8351V8.90118H0.000488281V20.8351H3.41018Z" fill="currentColor" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M8.52471 5.89395L6.81987 9.30364V19.1302H15.9953L18.7538 13.6133V9.7536C18.7538 9.28282 18.3721 8.90118 17.9014 8.90118H10.2296V2.93422C10.2296 2.46344 9.84791 2.0818 9.37714 2.0818H8.52471V5.89395ZM6.81987 0.376953H9.37714C10.7895 0.376953 11.9344 1.52188 11.9344 2.93422V7.19633H17.9014C19.3137 7.19633 20.4586 8.34126 20.4586 9.7536V14.0157L17.0489 20.8351H5.11502V8.90118L6.81987 5.49149V0.376953Z" fill="currentColor" />
                                </svg>
                                <p className="font-space-mono ml-[5px] mb-0"><b>{likeCounts}</b></p>
                            </button>
                            <button onClick={() => handleEngage(isDisliked ? 'delete' : 'insert', 'dislike')} className={clsx(
                                'flex flex-row items-start justify-start bg-inherit hover:text-light-green',
                                isDisliked ? 'text-red-300' : ''
                            )}  >
                                <svg width="21" height="21" viewBox="0 0 21 21" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.5063 0.3778L17.5063 12.3117L20.916 12.3117L20.916 0.3778L17.5063 0.3778Z" fill="currentColor" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M12.3918 15.3189L14.0966 11.9093L14.0966 2.08264L4.92122 2.08264L2.16272 7.59964L2.16272 11.4593C2.16272 11.9301 2.54437 12.3117 3.01515 12.3117L10.6869 12.3117L10.6869 18.2787C10.6869 18.7494 11.0686 19.1311 11.5394 19.1311L12.3918 19.1311L12.3918 15.3189ZM14.0966 20.8359L11.5394 20.8359C10.127 20.8359 8.9821 19.691 8.9821 18.2787L8.9821 14.0166L3.01514 14.0166C1.6028 14.0166 0.457879 12.8716 0.457879 11.4593L0.457879 7.19718L3.86757 0.377798L15.8015 0.3778L15.8015 12.3117L14.0966 15.7214L14.0966 20.8359Z" fill="currentColor" />
                                </svg>
                                <p className="font-space-mono ml-[5px] mb-0"><b>{dislikeCounts}</b></p>
                            </button>
                        </div>
                        {/* <div className="flex flex-row items-start justify-start">
                            <img className="w-[20px] mt-[5px] relative" alt="Comments" src="/images/comment.svg" />
                            <p className="font-space-mono ml-[5px] mb-0"><b>{comments}</b></p>
                        </div> */}
                        <div className="flex items-end justify-items-end cursor-pointer ">
                            <a href={hrefs} target='_blank' className="w-[40px] h-[40px] border-solid border-black border-[1px] bg-[transparent] text-center hover:text-light-green">
                                <svg width="21" height="17" viewBox="0 0 21 17" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-[20px] mt-[5px]">
                                    <g clipPath="url(#clip0_3109_16003)">
                                        <path d="M10.2033 0.210938C9.69608 0.210938 9.2811 0.630688 9.2811 1.14372V9.65531L7.52435 7.87837C7.34453 7.69648 7.11398 7.6032 6.87422 7.6032C6.63906 7.6032 6.40391 7.69648 6.22408 7.87837C5.86443 8.24216 5.86443 8.82514 6.22408 9.18892L9.50703 12.5283C9.69147 12.7148 9.94046 12.8081 10.1848 12.8034C10.1894 12.8034 10.1941 12.8034 10.1987 12.8034C10.2033 12.8034 10.2079 12.7894 10.2125 12.7894C10.4615 12.7988 10.7013 12.7195 10.8903 12.5283L14.1733 9.18892C14.5329 8.82514 14.5329 8.24216 14.1733 7.87837C13.9934 7.69648 13.7629 7.6032 13.5231 7.6032C13.288 7.6032 13.0528 7.69648 12.873 7.87837L11.1162 9.65531V1.14372C11.1162 0.630688 10.7013 0.210938 10.1941 0.210938H10.2033ZM0.981504 10.4435C0.474306 10.4435 0.0593262 10.8633 0.0593262 11.3763V14.2026C0.0593262 15.7464 1.29965 17.0009 2.82586 17.0009H17.5807C19.1069 17.0009 20.3472 15.7464 20.3472 14.2026V11.3763C20.3472 10.8633 19.9322 10.4435 19.4251 10.4435C18.9179 10.4435 18.5029 10.8633 18.5029 11.3763V14.2026C18.5029 14.7156 18.0879 15.1354 17.5807 15.1354H2.82586C2.31866 15.1354 1.90368 14.7156 1.90368 14.2026V11.3763C1.90368 10.8633 1.4887 10.4435 0.981504 10.4435Z" fill="currentColor" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_3109_16003">
                                            <rect width="20.2879" height="16.79" fill="currentColor" transform="translate(0.0593262 0.210938)" />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </a>
                        </div>
                        { isDisabled ? '' : (
                        <Button disabled={isDisabled} type='button' onClick={() => handleBoardFn(removeFromBoard ? 'delete' : 'insert')} className='border-l-0 grow-0 !text-[14px] !h-[40px]'>
                            {removeFromBoard ? 'Remove from' : 'Add to'} Board
                        </Button>
                        )}

                        {showNotification && (
                            <Notification
                                message={message}
                                subMessage={submessage}
                                type={messageType}
                            />

                        )}

                        <AddToBoard
                            boards={boards || []}
                            isOpen={isModalOpen}
                            onClose={() => setModalOpen(false)}
                            platform={source}
                            id={id}
                            pinboards={pinboards}

                            setMessage={setMessage}
                            setSubMessage={setSubMessage}
                            setMessageType={setMessageType}
                            setShowNotification={setShowNotification}
                        />

                    </div>
                </div>
            </div>
        </div>
    );
}
