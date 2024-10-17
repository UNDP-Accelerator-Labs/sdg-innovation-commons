import clsx from 'clsx';
import Link from 'next/link';

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    children?: React.ReactNode;
    href: string;
    openInNewTab?: boolean;
}

export function CardLink({ children, href, className, openInNewTab, ...rest }: Props) {
    return (
        <Link 
            href={href} 
            passHref 
            {...rest}
            className={clsx('w-[40px] h-[40px] block bg-inherit float-right text-right detach', className)}
            target={openInNewTab ? '_blank' : undefined} 
            rel={openInNewTab ? 'noopener noreferrer' : undefined} 
        >
            {/* Background and Border Elements */}
            {/*<div className="absolute h-[84.49%] w-[87.53%] top-[0%] right-[-0.04%] bottom-[15.51%] left-[12.51%] bg-lime-yellow transition-all duration-300 group-hover:top-[15%] group-hover:left-[0.03%]" />
            <div className="absolute h-[84.49%] w-[87.53%] top-[15.5%] right-[12.47%] bottom-[0.01%] left-[0%] border-black border-[0.7px] border-solid box-border" />*/}

            {/* Arrow Image */}
            <img
                className="relative w-[30px] max-w-full overflow-hidden max-h-full z-[2]"
                alt="Arrow Icon"
                src="/images/Arrow.svg"
            />
            {children}
        </Link>
    );
}
