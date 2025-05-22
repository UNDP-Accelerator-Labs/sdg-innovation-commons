'use client';
import clsx from 'clsx';
import { CardLink } from '@/app/ui/components/Link/card';

interface Props {
    item: any;
    className?: string;
}

export default function Link({
    item,
    className,
}: Props) {
    const { title, url } = item;

    if (!title || !url) return null;

    return (
        <div className={clsx('flex items-center gap-2 my-5', className)}>
            <CardLink className='mr-3' href={url} openInNewTab />
            <p className={clsx('text-inherit leading-[20px] mb-0', className)}>{title}</p>
        </div>
    );
}
