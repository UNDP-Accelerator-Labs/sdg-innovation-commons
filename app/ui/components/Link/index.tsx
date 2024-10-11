import clsx from 'clsx';
import Link from 'next/link';

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    children?: React.ReactNode;
    href: string;
}

export function LinkNav({ children, href, className, ...rest }: Props) {
    return (
        <Link href={href} passHref
            className={clsx(
                'group bg-inherit',
                className
            )}>
            {/* Background and Border Elements */}
            <div className="absolute h-[84.49%] w-[87.53%] top-[0%] right-[-0.04%] bottom-[15.51%] left-[12.51%] bg-lime-yellow transition-all duration-300 group-hover:top-[15%] group-hover:left-[0.03%]" />
            <div className="absolute h-[84.49%] w-[87.53%] top-[15.5%] right-[12.47%] bottom-[0.01%] left-[0%] border-black border-[0.7px] border-solid box-border" />

            {/* Arrow Image */}
            <img
                className="absolute h-[49.4%] w-[48.71%] top-[22.55%] right-[20.72%] bottom-[28.04%] left-[30.57%] max-w-full overflow-hidden max-h-full"
                alt="Arrow Icon"
                src="/images/Arrow.svg"
            />
            {/* Children (text or other content inside the link) */}
            {children}
        </Link>
    );
}
