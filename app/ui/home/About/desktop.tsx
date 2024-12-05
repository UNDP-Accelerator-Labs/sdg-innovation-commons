'use client';
import clsx from 'clsx';
import Link from 'next/link';
import { Button } from '@/app/ui/components/Button';
import { useRef } from 'react';
import { useIsVisible } from '@/app/ui/components/Interaction';

interface Props {
    className?: string;
};

export default function Section({
    className,
}: Props) {

    const ref = useRef<HTMLDivElement>(null);
    const isVisible = useIsVisible(ref);

    return (
        <>
        <section id='about-us' className={clsx('home-section px-0 py-0 !border-t-0', className)}>
            <div className='section-content grid grid-cols-9 gap-[20px]'>
                <div className="c-left col-span-4 bg-[url('/images/about-us-2.jpeg')] bg-cover bg-no-repeat">
                    <div className='h-full w-full top-0 left-0 [background:linear-gradient(173.09deg,_rgba(1,_141,_242,_1),_rgba(237,_255,_164,_1))] opacity-[.5]' />
                    <div className='absolute top-0 left-0 px-[80px] py-[100px]'>
                        <h2 ref={ref} className='mt-[5px]'>
                            <span className={clsx('yellow', isVisible ? 'slanted-bg' : '')}>
                                <span>About the commons</span>
                            </span>
                        </h2>
                    </div>
                </div>
                <div className='c-right col-span-5 col-start-6 pr-[80px] py-[120px]'>
                    <p className='lead'>
                        <b>Welcome to UNDP Accelerator Lab Network's central hub for multi-country SDG learnings that features insights and ready-to-deploy solutions for the Sustainable Development Goals and many more behind-the-scenes activities of the Network.</b>
                    </p>
                    <div className='columns-2 gap-[20px]'>
                        <p>Explore the early-stage results and insights generated by the Accelerator Labs Network in a suite of platforms newly released. These platforms are the first building blocks of an SDG Innovation Commons, a living hub of open knowledge where all UNDP colleagues – and, soon, academia, governments, civil society and private sector partners – are able to inquire and analyze the insights and data generated by the Labs and contribute to action-based learning on what it takes to reach the global Sustainable Development Goals.</p>
                        <p>We are constantly updating these platforms and curating the content available, reach out to us if you would like to be involved.</p>
                    </div>
                    <Button className="mt-[40px]">
                        <Link href={'/about'}>
                            About Us
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
        </>
    );
}