'use client';
import { useRef, useEffect } from 'react';

interface Props {
    item: any;
}

export default function Txt({
    item,
}: Props) {
    const { instruction, txt } = item;
    const ref = useRef<HTMLDivElement>(null);

    if (!txt?.length && !instruction?.length) return null;
    else {
        useEffect(() => {
            ref.current.innerHTML = txt ? txt.replace(/\n+/g, '<br/>') : null;
        }, [ref]);

        return (
            <>
            {!instruction ? null : (
                <p className='font-space-mono text-[14px] leading-[20px] mb-[10px]'><b>{instruction}</b></p>
            )}
            <p ref={ref} className='mb-[40px]'>{txt}</p>
            </>
        )
    }
}