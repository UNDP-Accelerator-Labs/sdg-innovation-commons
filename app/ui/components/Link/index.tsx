import Link from 'next/link';
import { useState } from 'react';
import Loading from '@/app/ui/components/Loading';

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    children?: React.ReactNode;
    href: string;
    openInNewTab?: boolean;
    passHref?: boolean;
    className?: string;
    scroll?: boolean;
}

export default function DefaultLink({ children, href, className, openInNewTab, scroll, ...rest }: Props) {
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        // Check if Ctrl (or Cmd on Mac) or Shift is pressed
        if (event.ctrlKey || event.metaKey || event.shiftKey || openInNewTab) {
            return; 
        }
        setIsLoading(true);
    };

    return (
        <>
            <Loading isLoading={isLoading && !openInNewTab} />
            <Link 
                href={href} 
                passHref 
                className={className}
                target={openInNewTab ? '_blank' : undefined} 
                rel={openInNewTab ? 'noopener noreferrer' : undefined} 
                onClick={handleClick}
                scroll={scroll}
                {...rest}
            >
                {children}
            </Link>
        </>
    );
}
