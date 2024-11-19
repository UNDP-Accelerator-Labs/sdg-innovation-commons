'use client';
import { useRef, useEffect } from 'react';

interface Props {
    item: any;
}

export default function Embed({
    item,
}: Props) {
    const { instruction, html } = item;
    const ref = useRef<HTMLDivElement>(null);
    
    if (!html?.length && !instruction?.length) return null;
    else {
        useEffect(() => {
            if (ref.current) ref.current.innerHTML = html.replace(/\s+/g, '<br/>');
        }, [ref]);

        return (
            <>
            {!instruction ? null : (
                <p className='font-space-mono text-[14px] leading-[20px] mb-[10px]'><b>{instruction}</b></p>
            )}
            <p ref={ref} className='mb-[40px]'></p>
            </>
        )
    }
}