'use client';
import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import Link from '@/app/ui/components/Link';
import { pin } from '@/app/lib/data/platform-api';
import { Button } from '@/app/ui/components/Button';
import { handleBoard, removeFromBoardApi } from './utils';
import { BoardInfo } from './with-img';
import { usePathname } from 'next/navigation';
import { useSharedState } from '@/app/ui/components/SharedState/Context';

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
  boardInfo?: BoardInfo;
  isLogedIn?: boolean;
  data?: any;
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
  className,
  boardInfo,
  isLogedIn,
  data,
}: CardProps) {
  const pathname = usePathname();
  const { sharedState, setSharedState } = useSharedState();
  const { session } = sharedState || {};

  const { removeFromBoard, boardId, isContributor } = boardInfo || {};
  const { pinboards } = data || {};
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const redirectUser = (pathname: string) => {
    window.history.replaceState(null, '', pathname);
    window.location.reload();
  };

  type ActionType = 'delete' | 'insert';

  const handleBoardFn = (action: ActionType) => {
    if (!isLogedIn) return showNotification();
    return handleBoard(
      removeFromBoard as boolean,
      showAddToBoardModal,
      (action) =>
        removeFromBoardApi(
          action,
          boardId as number,
          id,
          source as string,
          pin,
          showNotification,
          () => redirectUser(pathname)
        )
    );
  };

  const showAddToBoardModal = () => {
    setSharedState((prevState: any) => ({
      ...prevState,
      addToBoard: {
        showAddToBoardModal: true,
        platform: source,
        id,
        pinboards,
      },
    }));
  };

  type Notification = string | undefined;

  const showNotification = (
    message: Notification = 'Action Required!',
    submessage: Notification = 'You need to log in to engage with this post.',
    messageType: Notification = 'warning'
  ) => {
    setSharedState((prevState: any) => ({
      ...prevState,
      notification: {
        showNotification: true,
        message,
        submessage,
        messageType,
      },
    }));
  };

  useEffect(() => {
    let d =
      session?.rights > 2
        ? false
        : removeFromBoard && !isContributor
          ? true
          : false;
    setIsDisabled(d);
  }, [session]);

  return (
    <div
      className={clsx(
        'card relative flex w-full flex-col border-[1px]',
        className
      )}
    >
      {/* BAND WITH SOURCE NAME */}
      <Link href={href} passHref openInNewTab={openInNewTab}>
        <div
          className={clsx(
            'band flex w-full justify-between !border-t-0 lg:text-[14px]',
            tagStyle
          )}
        >
          <span>{boardInfo?.articleType || source}</span>
          <span>{date}</span>
        </div>
      </Link>
      {/* METADATA */}
      {/*<div className="flex flex-row items-start justify-between">
        <b className="relative text-undp-blue  font-space-mono">{country}</b>
        <b className="relative font-space-mono">{date}</b>
      </div>*/}
      {/* MAIN CONTENT */}
      <div className="content flex grow flex-col justify-between px-[20px] py-[20px]">
        <div>
          <Link
            href={href}
            passHref
            openInNewTab={openInNewTab}
          >
            <h1>{title.replace(/\&amp;/g, '&')}</h1>
            <p>{description.replace(/\&amp;/g, '&')}</p>
          </Link>
        </div>
        {/* TYPE INFO */}
        <div className="mt-[20px] flex flex-row justify-between">
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
          <button type="button" className="chip bg-black text-white">
            {country}
          </button>

          {isDisabled ? (
            ''
          ) : (
            <Button
              disabled={isDisabled}
              type="button"
              onClick={() =>
                handleBoardFn(removeFromBoard ? 'delete' : 'insert')
              }
              className="!h-[40px] grow-0 border-l-0 !text-[14px]"
            >
              {removeFromBoard ? 'Remove from' : 'Add to'} Board
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
