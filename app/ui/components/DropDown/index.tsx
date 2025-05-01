import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { Button } from '@/app/ui/components/Button';
import clsx from 'clsx';

interface Props extends React.HTMLAttributes<HTMLElement> {
    children: React.ReactNode;
    className?: string;
    height?: string;
}

export default function DropDown({ children, className, ...rest }: Props) {
    return (
        <Menu as="div" className={clsx("relative inline-block text-left", className)}>
            <div className={clsx('h-[60px] font-bold font-space-mono text-[18px] px-[40px] detach', rest?.height)}>
                <span className='relative z-[2]'>
                    <MenuButton className="inline-flex w-full justify-center gap-x-1.5 bg-inherit  px-3 py-5 text-inherit ">
                        Options
                        <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-inherit" />
                    </MenuButton>
                </span>
            </div>

            <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
            >
                <div className="py-1">
                    {children}
                </div>
            </MenuItems>
        </Menu>
    )
}
