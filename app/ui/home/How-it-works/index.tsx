'use client';

import { Button } from '@/app/ui/components/Button';
import Link from 'next/link';
import { useRef } from 'react';
import { useIsVisible } from '@/app/ui/components/Interaction';

export default function Section() {
    const ref = useRef<HTMLDivElement>(null);
    const isVisible = useIsVisible(ref);

    return (
        <>
            <section className='lg:home-section lg:px-[80px] lg:py-[100px]'>
                {/* Display the section title and description */}
                <div className='section-header lg:mb-[100px]'>
                    <div className='c-left lg:col-span-5'>
                        <h2 ref={ref} className={`yellow lg:mt-[5px] ${isVisible ? 'slanted-bg' : ''}`}>
                            <span>How it Works</span>
                        </h2>
                    </div>
                    <div className='c-right lg:col-span-4 lg:mt-[20px]'>
                        <p className="lead">
                            <b>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.</b>
                        </p>
                        <Button className='mt-[20px]'>
                            <Link href={'#contact'}>
                                Join Platform
                            </Link>
                        </Button>
                    </div>
                </div>
                <div className='section-content'>                
                    {/* Grid system for responsive layout */}
                    <div className='grid gap-[20px] lg:grid-cols-4'>
                        {cards.map((card) => (
                            <div key={card.id} className='relative post-it'>
                                <div className='flex flex-row justify-between items-center mb-[120px]'>
                                    <b className="font-space-mono text-[42px]">{card.number}</b>
                                    <img className="top-[30px] right-10  w-14 h-14 overflow-hidden lg:flex hidden" alt="" src="/images/Layer_1.svg" />
                                </div>
                                <div>
                                    <div>
                                        <p>{card.text}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

const cards = [
    {
        id: 1,
        text: "Working on a wicked challenge? Get in touch with a Lab to co-create.",
        number: "01",
    },
    {
        id: 2,
        text: (
            <>
                Submit on the ground SDG solutions you see.
            </>
        ),
        number: "02",
    },
    {
        id: 3,
        text: "Share your actionable insights and learnings.",
        number: "03",
    },
    {
        id: 4,
        text: "Create your own SDG inspiration board.",
        number: "04",
    },
];