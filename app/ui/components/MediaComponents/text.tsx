'use client';
import clsx from 'clsx';
import { useRef, useEffect } from 'react';

interface Props {
    item: any;
    className?: string;
}

export default function Txt({
    item,
    className,
}: Props) {
    const { instruction, txt } = item;
    const ref = useRef<HTMLDivElement>(null);

    if (!txt?.length && !instruction?.length) return null;
    else {
        useEffect(() => {
            if (ref.current) ref.current.innerHTML = txt ? txt.replace(/\n+/g, '<br/>') : null;
        }, [ref]);

        return (
            <>
            {!instruction ? null : (
                <p className={clsx('font-space-mono text-[14px] leading-[20px] mb-[10px]', className)}><b>{instruction}</b></p>
            )}
            <p ref={ref} className={clsx('mb-[40px]', className)}>{txt}</p>
            </>
        )
    }
}