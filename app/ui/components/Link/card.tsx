'use client';
import clsx from 'clsx';
import Link from '@/app/ui/components/Link';
import { useState } from 'react';
import Loading from '@/app/ui/components/Loading';

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    children?: React.ReactNode;
    href: string;
    openInNewTab?: boolean;
    passHref?: boolean;
    className?: string;
}

export function CardLink({ children, href, className, openInNewTab, ...rest }: Props) {
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = () => {
        setIsLoading(true);
    };
    return (
        <>
            <Loading isLoading={isLoading} />
            <Link 
                href={href} 
                passHref 
                className={clsx('w-[40px] h-[40px] block bg-inherit float-right text-right detach', className)}
                target={openInNewTab ? '_blank' : undefined} 
                rel={openInNewTab ? 'noopener noreferrer' : undefined} 
                onClick={handleClick}
                // prefetch={true}
                {...rest}
            >
                <img
                    className="relative w-[30px] max-w-full overflow-hidden max-h-full z-[2]"
                    alt="Arrow Icon"
                    src="/images/Arrow.svg"
                />
                {children}
            </Link>
        </>
    );
}
