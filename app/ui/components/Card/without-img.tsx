'use client';
import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import Link from '@/app/ui/components/Link';
import { Button } from '@/app/ui/components/Button';
import { handleBoard, removeFromBoardApi } from './utils';
import { BoardInfo } from './with-img';
import { usePathname } from 'next/navigation';
import { useSharedState } from '@/app/ui/components/SharedState/Context';
import { CardOptions } from './commons';

export interface CardProps {
  id: number | string;
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
  isExternal?: boolean;
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

  const handleBoardFn = (action: ActionType, triggerAddToBoard: boolean = false) => {
    if (!isLogedIn) return showNotification();
    if (triggerAddToBoard) return showAddToBoardModal();
    return handleBoard(
      removeFromBoard as boolean,
      showAddToBoardModal,
      (action) =>
        removeFromBoardApi(
          action,
          boardId as number,
          Number(id),
          source as string,
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
      
      <div className="content flex grow flex-col justify-between px-[20px] py-[20px]">
        <div>
          <Link
            href={href}
            passHref
            openInNewTab={openInNewTab}
          >
            <h1>{title?.replace(/\&amp;/g, '&')}</h1>
            <p>{typeof description === 'string' ? description.replace(/\&amp;/g, '&') : Array.isArray(description) ? description[0]?.replace(/\&amp;/g, '&') || '' : ''}</p>
          </Link>
        </div>
        {/* TYPE INFO */}
        <div className="mt-[20px] flex flex-row justify-between">
          <button type="button" className="chip bg-black text-white">
            {country}
          </button>

          {/* Button for adding to board */}
          {/* If the user is logged in and not on the board page, show the button */}
          {(isDisabled || removeFromBoard) ? (
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


          {/* Dropdown for adding to board */}
          {/* If the user is logged in and on the board page, show the dropdown */}
          {(isLogedIn && removeFromBoard) ? (
            <CardOptions
              onAddToNewBoard={() => handleBoardFn('insert', true)}
              onRemoveFromBoard={() => handleBoardFn('delete')}
            />
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  );
}
