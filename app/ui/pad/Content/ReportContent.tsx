'use client';
import React from 'react';
import { useSharedState } from '@/app/ui/components/SharedState/Context';
import FlagContent from '@/app/ui/components/FlagContent';

interface Props {
  id: number;
  platform: string;
  contentType: string;
  title: string;
}

export default function ReportContent({ id, platform, contentType, title }: Props) {
  const { sharedState } = useSharedState();
  const { isLogedIn } = sharedState || {};

  if (!isLogedIn) return null;

  return (
    <div className="inner mx-auto bg-gray-100 pt-5 px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 border-b-1 border-t-1 border-black border-solid">
      <div className="section-content pl-8">
        <div className="flex items-center justify-between pt-[40px]">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Report Content
            </h3>
            <p className="text-sm text-gray-600">
              Found something inappropriate or concerning? Help us maintain a
              safe community by reporting this content.
            </p>
          </div>
          <div className="mx-4">
            <FlagContent
              contentId={id}
              platform={platform}
              contentType={contentType}
              contentTitle={title}
            />
          </div>
        </div>
      </div>
    </div>
  );
}