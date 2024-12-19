'use client';
import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { pin } from '@/app/lib/data/platform-api';
import Notification from '@/app/ui/components/Notification';
import { Button } from '@/app/ui/components/Button';
import AddToBoard from '@/app/ui/components/Modal/add-to-board';
import {
  handleShowNotification,
  handleBoard,
  removeFromBoardApi,
} from './utils';
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
  const { boards, removeFromBoard, boardId, isContributor } = boardInfo || {};
  const { pinboards } = data || {};
  //Notification DOM states
  const [showNotification, setShowNotification] = useState(false);
  const [message, setMessage] = useState<string>('Action Required!');
  const [submessage, setSubMessage] = useState<string>(
    'You need to log in to engage with this post.'
  );
  const [messageType, setMessageType] = useState<string>('warning');

  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const redirectUser = (pathname: string) => {
    window.history.replaceState(null, '', pathname);
    window.location.reload();
  };

  type ActionType = 'delete' | 'insert';

  const handleBoardFn = (action: ActionType) => {
    return handleBoard(
      isLogedIn as boolean,
      removeFromBoard as boolean,
      setModalOpen,
      () => handleShowNotification(setShowNotification),
      (action) =>
        removeFromBoardApi(
          action,
          boardId as number,
          id,
          source as string,
          pin,
          setMessage,
          setMessageType,
          setSubMessage,
          setShowNotification,
          () => redirectUser(pathname),
          setModalOpen
        )
    );
  };

  const { sharedState } = useSharedState();
  const { session } = sharedState || {};

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
      <Link href={href} passHref target={'_blank'} rel={'noopener noreferrer'}>
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
            target={'_blank'}
            rel={'noopener noreferrer'}
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
        platform={source as string}
        id={id}
        pinboards={pinboards}
        setMessage={setMessage}
        setSubMessage={setSubMessage}
        setMessageType={setMessageType}
        setShowNotification={setShowNotification}
      />
    </div>
  );
}
