'use client';
import DOMPurify from 'isomorphic-dompurify';

interface Props {
    item: any;
}

export default function Embed({ item }: Props) {
    const { instruction, html } = item;

    if (!html?.length && !instruction?.length) return null;

    // Sanitize the HTML content
    let sanitizedHtml = DOMPurify.sanitize(html);

    // Add required class to all <a> tags using a regular expression
    sanitizedHtml = sanitizedHtml.replace(
        /<a\s+/g,
        '<a target="_blank" class="text-blue-500 cursor-pointer" '
    );

    return (
        <>
            {!instruction ? null : (
                <p className="font-space-mono text-[14px] leading-[20px] mb-[10px]">
                    <b>{instruction}</b>
                </p>
            )}
            <div
                className="mb-[40px]"
                dangerouslySetInnerHTML={{
                    __html: sanitizedHtml,
                }}
            ></div>
        </>
    );
}