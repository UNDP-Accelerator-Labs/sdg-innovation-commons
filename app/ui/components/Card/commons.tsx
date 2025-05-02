'use client';
import React from 'react';
import clsx from 'clsx';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

interface CardOptionsProps {
  onAddToNewBoard: () => void;
  onRemoveFromBoard: () => void;
  className?: string;
}

export const CardOptions: React.FC<CardOptionsProps> = ({
  onAddToNewBoard,
  onRemoveFromBoard,
  className,
}) => {
  return (
    <div className={clsx('relative', className)}>
      <Menu as="div" className="relative inline-block text-left">
        <div className="h-[40px] font-bold font-space-mono text-[14px] px-[40px] detach">
          <span className="relative z-[2]">
            <MenuButton className="inline-flex bg-inherit text-inherit font-bold font-space-mono">
              Options
              <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-inherit" />
            </MenuButton>
          </span>
        </div>

        <MenuItems
          transition
          className={clsx(
            'absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none',
            'overflow-hidden max-w-full'
          )}
          style={{
            maxWidth: 'calc(100vw - 20px)', // Prevent overflow on smaller screens
            right: 'auto', // Adjust positioning dynamically
            left: 'auto',
          }}
        >
          <div className="py-1">
            {/* Add to New Board */}
            <MenuItem as="button" className="w-full bg-white text-start hover:bg-lime-yellow">
              <div
                className="block border-none font-space-mono bg-inherit p-4 text-base text-inherit focus:bg-gray-100 focus:text-gray-900 focus:outline-none"
                onClick={onAddToNewBoard}
              >
                Add to new board
              </div>
            </MenuItem>

            {/* Remove from Board */}
            <MenuItem as="button" className="w-full bg-white text-start hover:bg-lime-yellow">
              <div
                className="block border-none bg-inherit font-space-mono p-4 text-base text-inherit focus:bg-gray-100 focus:text-gray-900 focus:outline-none"
                onClick={onRemoveFromBoard}
              >
                Remove from this board
              </div>
            </MenuItem>
          </div>
        </MenuItems>
      </Menu>
    </div>
  );
};