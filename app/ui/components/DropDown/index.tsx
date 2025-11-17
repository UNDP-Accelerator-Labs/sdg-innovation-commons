'use client';

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx';

interface Props extends React.HTMLAttributes<HTMLElement> {
    children: React.ReactNode;
    className?: string;
    secondaryClassName?: string;
    label?: string;
}

export default function DropDown({ children, className, label, secondaryClassName }: Props) {
    return (
        <Menu as="div" className={clsx("relative inline-block text-left", className)}>
            <div className={clsx('h-[60px] font-bold font-space-mono text-[18px] px-[40px] detach', secondaryClassName)}>
                <span className='relative z-[2]'>
                    <MenuButton className="inline-flex w-full justify-center gap-x-1.5 bg-inherit  px-3 py-5 text-inherit ">
                        {label || 'Options'}
                        <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-inherit" />
                    </MenuButton>
                </span>
            </div>

            <MenuItems
                className="absolute right-0 z-[9999] mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none"
            >
                <div className="py-1">
                    {children}
                </div>
            </MenuItems>
        </Menu>
    )
}
