'use client';
import clsx from 'clsx';
import { useRef, useEffect } from 'react';

interface Props {
    item: any;
    className?: string;
}

export default function List({
    item,
    className,
}: Props) {
    const { instruction, items } = item;

    return (
        <>
        {!instruction ? null : (
            <p className={clsx('font-space-mono text-[14px] leading-[20px] mb-[10px]', className)}><b>{instruction}</b></p>
        )}
        <ul className='mb-[40px] mt-0'>
            {items.map((d: string, i: number) =>  (
                <li key={i} className={clsx('mb-[10px]', className)} dangerouslySetInnerHTML={{ __html: d }} />
            ))}
        </ul>
        </>
    )
}