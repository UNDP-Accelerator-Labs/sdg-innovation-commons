/**
 * Actions menu component for download and add-to-board actions
 * @module test/[platform]/components/ActionsMenu
 */

'use client';

import { MenuItem } from '@headlessui/react';
import DropDown from '@/app/ui/components/DropDown';

interface ActionsMenuProps {
  allowDownload: boolean;
  downloadUrl: string;
  isLoggedIn: boolean;
  hasSearchOrFilters: boolean;
  hasResults: boolean;
  onAddAllToBoard: (e: React.MouseEvent) => void;
}

export default function ActionsMenu({
  allowDownload,
  downloadUrl,
  isLoggedIn,
  hasSearchOrFilters,
  hasResults,
  onAddAllToBoard,
}: ActionsMenuProps) {
  const showDownload =  false // disable download buttin from view => allowDownload && downloadUrl?.length > 0;
  const showAddToBoard = isLoggedIn && hasSearchOrFilters && hasResults;

  // Don't render if no actions available
  if (!showDownload && !showAddToBoard) {
    return null;
  }

  return (
    <DropDown>
      {/* {showDownload && (
        <MenuItem
          as="button"
          className="w-full bg-white text-start hover:bg-lime-yellow"
        >
          <a
            className="block p-4 text-base text-inherit data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Download All
          </a>
        </MenuItem>
      )} */}
      {showAddToBoard && (
        <MenuItem
          as="button"
          className="w-full bg-white text-start hover:bg-lime-yellow"
        >
          <div
            className="block cursor-pointer p-4 text-base text-inherit data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
            onClick={onAddAllToBoard}
          >
            Add All to Board
          </div>
        </MenuItem>
      )}
    </DropDown>
  );
}
