'use client';
import React, { useState } from 'react';
import { useSharedState } from '@/app/ui/components/SharedState/Context';
import { engage } from '@/app/ui/components/Card/utils';
import { engageApi } from '@/app/lib/data/platform';
import { EngagementType, ActionType } from '@/app/ui/components/Card/utils';
import clsx from 'clsx';

interface Props {
  id: number;
  platform?: string;
  current_user_engagement?: any[];
  engagement?: any[];
  ownername?: string;
}

export default function Feedback({
  id,
  platform,
  current_user_engagement,
  engagement,
  ownername = '',
}: Props) {
  const { setSharedState, sharedState } = useSharedState();
  const { isLogedIn, session } = sharedState || {};
  const [selected, setSelected] = useState<EngagementType | null>(() => {
    const engagement = current_user_engagement?.find((d) =>
      ['useful', 'interesting', 'no_opinion'].includes(d?.type)
    );
    return engagement ? engagement.type : null;
  });

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

  const handleEngage = async (action: ActionType, type: EngagementType) => {
    if (!isLogedIn) return showNotification();
    return engage(
      action,
      type,
      platform as string,
      id,
      engageApi,
      (setIsLiked: any) => {},
      (setIsDisliked: any) => {},
      0 as number,
      (setLikeCounts: any) => {},
      0 as number,
      (setDislikeCounts: any) => {}
    );
  };

  const getEngagementCount = (type: EngagementType) => {
    return engagement?.filter((e) => e.type === type).length || 0;
  };

  if (!isLogedIn) return null;

  return (
    <div className="inner mx-auto bg-gray-200 py-5 px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 ">
      <div className="section-content pl-8">
        <h5 className="text-lg font-semibold">What do you think about this content?</h5>
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-5">
          {[
            { txt: 'I find this content useful for my work.', type: 'useful' },
            { txt: 'I find this content interesting.', type: 'interesting' },
            {
              txt: 'I have no opinion about this content.',
              type: 'no_opinion',
            },
          ].map((text, index) => (
            <div
              key={index}
              className={clsx(
                'chip !h-auto min-h-[30px] cursor-pointer border-[1px] border-solid py-[5px] text-left text-[12px] normal-case hover:bg-lime-yellow',
                selected === text.type ? 'bg-lime-yellow' : 'bg-white'
              )}
              onClick={() => {
                if (selected === text.type) {
                  setSelected(null);
                  handleEngage('delete', text.type as EngagementType);
                } else {
                  if (selected !== null) {
                    handleEngage('delete', selected);
                  }
                  setSelected(text.type as EngagementType);
                  handleEngage('insert', text.type as EngagementType);
                }
              }}
            >
              {text.txt}
            </div>
          ))}
        </div>

        {/* Show engagement statistics to owner and admin only */}
        {session?.rights >= 3 || session?.name === ownername ? (
          <div className="mt-5 text-sm">
            <h4>Engagement Statistics (visible only to content owner and admin)</h4>
            <ul className="mx-0">\n              <li>{getEngagementCount('useful') || 0} found this useful.</li>
              <li>
                {getEngagementCount('interesting') || 0} found this interesting.
              </li>
              <li>
                {getEngagementCount('no_opinion') || 0} people have no opinion.
              </li>
              <li>
                {getEngagementCount('like') || 0} people reacted with a thumb
                up.
              </li>
              <li>
                {getEngagementCount('dislike') || 0} people reacted with a thumb
                down.
              </li>
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}