'use client';
import clsx from 'clsx';
import DOMPurify from 'isomorphic-dompurify';

interface Props {
    item: any;
    className?: string;
}

export default function Txt({
    item,
    className,
}: Props) {
    const { instruction, txt } = item;

    if (!txt?.length && !instruction?.length) return null;

    // Sanitize the text content
    let sanitizedTxt = DOMPurify.sanitize(txt);

    // Add required class to all <a> tags using a regular expression
    sanitizedTxt = sanitizedTxt.replace(
        /<a\s+/g,
        '<a target="_blank" class="text-blue-500 cursor-pointer" '
    );

    return (
        <>
            {!instruction ? null : (
                <p className={clsx('font-space-mono text-[14px] leading-[20px] mb-[10px]', className)}>
                    <b>{instruction}</b>
                </p>
            )}
            <div
                className={clsx('mb-[40px]', className)}
                dangerouslySetInnerHTML={{
                    __html: sanitizedTxt,
                }}
            ></div>
        </>
    );
}